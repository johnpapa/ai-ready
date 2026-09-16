"""Glob matching with the semantics the detection tables assume.

Deliberately small and dependency-free so CI needs nothing but Python.

Rules, matched against a POSIX repo-relative path:

    **/     zero or more leading path segments
    **      (trailing) one or more remaining segments
    *       any run of characters inside one segment
    ?       one character inside one segment

Everything else is literal.
"""

import re

_CACHE = {}


def translate(glob: str) -> str:
    """Convert a glob to an anchored regular expression."""
    parts = glob.split("/")
    out = []
    for i, part in enumerate(parts):
        last = i == len(parts) - 1
        if part == "**":
            # `**` as the final segment must consume at least one segment, so
            # `.github/workflows/**` matches a file inside the directory but not
            # the bare directory path itself.
            out.append(".+" if last else "(?:[^/]+/)*")
            continue
        seg = ""
        for ch in part:
            if ch == "*":
                seg += "[^/]*"
            elif ch == "?":
                seg += "[^/]"
            else:
                seg += re.escape(ch)
        out.append(seg if last else seg + "/")
    return "^" + "".join(out) + "$"


def matches(glob: str, path: str) -> bool:
    if glob not in _CACHE:
        _CACHE[glob] = re.compile(translate(glob))
    return _CACHE[glob].match(path) is not None


def any_match(globs, path: str) -> bool:
    return any(matches(g, path) for g in globs)


def matching_paths(globs, paths):
    return [p for p in paths if any_match(globs, p)]
