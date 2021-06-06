Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.
Example: grep -i 'hello world' menu.h main.c
PATTERNS can contain multiple patterns separated by newlines.

OPTIONS:
{% for group,params in groups %}
{% for param in params %}
{% if param.hidden != true -%}
{{ param.humanReadable|padEnd(params.padding, params.prepadding, opts.paramDescriptionSpacer) }} {{param.help}}
{%- endif %}
{%- endfor %}
{% endfor %}

When FILE is '-', read standard input.  With no FILE, read '.' if
recursive, '-' otherwise.  With fewer than two FILEs, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report bugs to: bug-grep@gnu.org
GNU grep home page: <http://www.gnu.org/software/grep/>
General help using GNU software: <https://www.gnu.org/gethelp/>
