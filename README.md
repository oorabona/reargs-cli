# reargs-cli - A CLI tool to help create and validate argument parsing with Reargs

This is both a helper for your (daily !) usage of [Reargs](https://github.com/oorabona/reargs) and also a showcase since it serves as a quite complete example of its usage.

Basically this program takes an input file (or stdin) and try its best to gather the command line parameters, `short` and `long` versions, `help` and if told so it can also prepare the Regular Expressions to match.

Let's see!

> **NOTE**
> You can find all the examples in the [examples](examples/) directory.

## An example: **grep**

So imagine you want to create a `grep` clone in `NodeJS` :rocket:

<details>
<summary>Click to show a typical output of `grep --help`</summary>
<p>

```sh
$ grep --help
Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.
Example: grep -i 'hello world' menu.h main.c
PATTERNS can contain multiple patterns separated by newlines.

Pattern selection and interpretation:
  -E, --extended-regexp     PATTERNS are extended regular expressions
  -F, --fixed-strings       PATTERNS are strings
  -G, --basic-regexp        PATTERNS are basic regular expressions
  -P, --perl-regexp         PATTERNS are Perl regular expressions
  -e, --regexp=PATTERNS     use PATTERNS for matching
  -f, --file=FILE           take PATTERNS from FILE
  -i, --ignore-case         ignore case distinctions in patterns and data
      --no-ignore-case      do not ignore case distinctions (default)
  -w, --word-regexp         match only whole words
  -x, --line-regexp         match only whole lines
  -z, --null-data           a data line ends in 0 byte, not newline

Miscellaneous:
  -s, --no-messages         suppress error messages
  -v, --invert-match        select non-matching lines
  -V, --version             display version information and exit
      --help                display this help text and exit

Output control:
  -m, --max-count=NUM       stop after NUM selected lines
  -b, --byte-offset         print the byte offset with output lines
  -n, --line-number         print line number with output lines
      --line-buffered       flush output on every line
  -H, --with-filename       print file name with output lines
  -h, --no-filename         suppress the file name prefix on output
      --label=LABEL         use LABEL as the standard input file name prefix
  -o, --only-matching       show only nonempty parts of lines that match
  -q, --quiet, --silent     suppress all normal output
      --binary-files=TYPE   assume that binary files are TYPE;
                            TYPE is 'binary', 'text', or 'without-match'
  -a, --text                equivalent to --binary-files=text
  -I                        equivalent to --binary-files=without-match
  -d, --directories=ACTION  how to handle directories;
                            ACTION is 'read', 'recurse', or 'skip'
  -D, --devices=ACTION      how to handle devices, FIFOs and sockets;
                            ACTION is 'read' or 'skip'
  -r, --recursive           like --directories=recurse
  -R, --dereference-recursive  likewise, but follow all symlinks
      --include=GLOB        search only files that match GLOB (a file pattern)
      --exclude=GLOB        skip files that match GLOB
      --exclude-from=FILE   skip files that match any file pattern from FILE
      --exclude-dir=GLOB    skip directories that match GLOB
  -L, --files-without-match  print only names of FILEs with no selected lines
  -l, --files-with-matches  print only names of FILEs with selected lines
  -c, --count               print only a count of selected lines per FILE
  -T, --initial-tab         make tabs line up (if needed)
  -Z, --null                print 0 byte after FILE name

Context control:
  -B, --before-context=NUM  print NUM lines of leading context
  -A, --after-context=NUM   print NUM lines of trailing context
  -C, --context=NUM         print NUM lines of output context
  -NUM                      same as --context=NUM
      --color[=WHEN],
      --colour[=WHEN]       use markers to highlight the matching strings;
                            WHEN is 'always', 'never', or 'auto'
  -U, --binary              do not strip CR characters at EOL (MSDOS/Windows)

When FILE is '-', read standard input.  With no FILE, read '.' if
recursive, '-' otherwise.  With fewer than two FILEs, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report bugs to: bug-grep@gnu.org
GNU grep home page: <http://www.gnu.org/software/grep/>
General help using GNU software: <https://www.gnu.org/gethelp/>
```

</p>
</details>

### Basic usage

The default parser (a regular expression of course) can handle parsing this typical help with this simple command below

```sh
$ grep --help | reargs -r
```

> Note: `-r` here removes undefined attributes (like if there is no short parameter, do not output it).

<details>
<summary>Click here to see the output</summary>
<p>

```js
exports = {
  extendedregexp: {
    short: '-E',
    long: '--extended-regexp',
    humanReadable: '-E, --extended-regexp',
    help: 'PATTERNS are extended regular expressions'
  },
  fixedstrings: {
    short: '-F',
    long: '--fixed-strings',
    humanReadable: '-F, --fixed-strings',
    help: 'PATTERNS are strings'
  },
  basicregexp: {
    short: '-G',
    long: '--basic-regexp',
    humanReadable: '-G, --basic-regexp',
    help: 'PATTERNS are basic regular expressions'
  },
  perlregexp: {
    short: '-P',
    long: '--perl-regexp',
    humanReadable: '-P, --perl-regexp',
    help: 'PATTERNS are Perl regular expressions'
  },
  regexpPATTERNS: {
    short: '-e[^\\ ]+',
    long: '--regexp=[^\\ ]+',
    humanReadable: '-e, --regexp=PATTERNS',
    help: 'use PATTERNS for matching'
  },
  fileFILE: {
    short: '-f[^\\ ]+',
    long: '--file=[^\\ ]+',
    humanReadable: '-f, --file=FILE',
    help: 'take PATTERNS from FILE'
  },
  ignorecase: {
    short: '-i',
    long: '--ignore-case',
    humanReadable: '-i, --ignore-case',
    help: 'ignore case distinctions in patterns and data'
  },
  noignorecase: {
    long: '--no-ignore-case',
    humanReadable: '--no-ignore-case',
    help: 'do not ignore case distinctions (default)'
  },
  wordregexp: {
    short: '-w',
    long: '--word-regexp',
    humanReadable: '-w, --word-regexp',
    help: 'match only whole words'
  },
  lineregexp: {
    short: '-x',
    long: '--line-regexp',
    humanReadable: '-x, --line-regexp',
    help: 'match only whole lines'
  },
  nulldata: {
    short: '-z',
    long: '--null-data',
    humanReadable: '-z, --null-data',
    help: 'a data line ends in 0 byte, not newline'
  },
  nomessages: {
    short: '-s',
    long: '--no-messages',
    humanReadable: '-s, --no-messages',
    help: 'suppress error messages'
  },
  invertmatch: {
    short: '-v',
    long: '--invert-match',
    humanReadable: '-v, --invert-match',
    help: 'select non-matching lines'
  },
  version: {
    short: '-V',
    long: '--version',
    humanReadable: '-V, --version',
    help: 'display version information and exit'
  },
  help: {
    long: '--help',
    humanReadable: '--help',
    help: 'display this help text and exit'
  },
  maxcountNUM: {
    short: '-m[^\\ ]+',
    long: '--max-count=[^\\ ]+',
    humanReadable: '-m, --max-count=NUM',
    help: 'stop after NUM selected lines'
  },
  byteoffset: {
    short: '-b',
    long: '--byte-offset',
    humanReadable: '-b, --byte-offset',
    help: 'print the byte offset with output lines'
  },
  linenumber: {
    short: '-n',
    long: '--line-number',
    humanReadable: '-n, --line-number',
    help: 'print line number with output lines'
  },
  linebuffered: {
    long: '--line-buffered',
    humanReadable: '--line-buffered',
    help: 'flush output on every line'
  },
  withfilename: {
    short: '-H',
    long: '--with-filename',
    humanReadable: '-H, --with-filename',
    help: 'print file name with output lines'
  },
  nofilename: {
    short: '-h',
    long: '--no-filename',
    humanReadable: '-h, --no-filename',
    help: 'suppress the file name prefix on output'
  },
  labelLABEL: {
    long: '--label=[^\\ ]+',
    humanReadable: '--label=LABEL',
    help: 'use LABEL as the standard input file name prefix'
  },
  onlymatching: {
    short: '-o',
    long: '--only-matching',
    humanReadable: '-o, --only-matching',
    help: 'show only nonempty parts of lines that match'
  },
  silent: {
    short: '-q',
    long: '--silent',
    humanReadable: '-q, --silent',
    help: 'suppress all normal output'
  },
  binaryfilesTYPE: {
    long: '--binary-files=[^\\ ]+',
    humanReadable: '--binary-files=TYPE',
    help: 'assume that binary files are TYPE;'
  },
  param: {
    humanReadable: '',
    help: "TYPE is 'binary', 'text', or 'without-match'"
  },
  text: {
    short: '-a',
    long: '--text',
    humanReadable: '-a, --text',
    help: 'equivalent to --binary-files=text'
  },
  I: {
    short: '-I',
    humanReadable: '-I',
    help: 'equivalent to --binary-files=without-match'
  },
  directoriesACTION: {
    short: '-d[^\\ ]+',
    long: '--directories=[^\\ ]+',
    humanReadable: '-d, --directories=ACTION',
    help: 'how to handle directories;\n' +
      "                            ACTION is 'read', 'recurse', or 'skip'"
  },
  devicesACTION: {
    short: '-D[^\\ ]+',
    long: '--devices=[^\\ ]+',
    humanReadable: '-D, --devices=ACTION',
    help: 'how to handle devices, FIFOs and sockets;\n' +
      "                            ACTION is 'read' or 'skip'"
  },
  recursive: {
    short: '-r',
    long: '--recursive',
    humanReadable: '-r, --recursive',
    help: 'like --directories=recurse'
  },
  dereferencerecursive: {
    short: '-R',
    long: '--dereference-recursive',
    humanReadable: '-R, --dereference-recursive',
    help: 'likewise, but follow all symlinks'
  },
  includeGLOB: {
    long: '--include=[^\\ ]+',
    humanReadable: '--include=GLOB',
    help: 'search only files that match GLOB (a file pattern)'
  },
  excludeGLOB: {
    long: '--exclude=[^\\ ]+',
    humanReadable: '--exclude=GLOB',
    help: 'skip files that match GLOB'
  },
  excludefromFILE: {
    long: '--exclude-from=[^\\ ]+',
    humanReadable: '--exclude-from=FILE',
    help: 'skip files that match any file pattern from FILE'
  },
  excludedirGLOB: {
    long: '--exclude-dir=[^\\ ]+',
    humanReadable: '--exclude-dir=GLOB',
    help: 'skip directories that match GLOB'
  },
  fileswithoutmatch: {
    short: '-L',
    long: '--files-without-match',
    humanReadable: '-L, --files-without-match',
    help: 'print only names of FILEs with no selected lines'
  },
  fileswithmatches: {
    short: '-l',
    long: '--files-with-matches',
    humanReadable: '-l, --files-with-matches',
    help: 'print only names of FILEs with selected lines'
  },
  count: {
    short: '-c',
    long: '--count',
    humanReadable: '-c, --count',
    help: 'print only a count of selected lines per FILE'
  },
  initialtab: {
    short: '-T',
    long: '--initial-tab',
    humanReadable: '-T, --initial-tab',
    help: 'make tabs line up (if needed)'
  },
  null: {
    short: '-Z',
    long: '--null',
    humanReadable: '-Z, --null',
    help: 'print 0 byte after FILE name'
  },
  beforecontextNUM: {
    short: '-B[^\\ ]+',
    long: '--before-context=[^\\ ]+',
    humanReadable: '-B, --before-context=NUM',
    help: 'print NUM lines of leading context'
  },
  aftercontextNUM: {
    short: '-A[^\\ ]+',
    long: '--after-context=[^\\ ]+',
    humanReadable: '-A, --after-context=NUM',
    help: 'print NUM lines of trailing context'
  },
  contextNUM: {
    short: '-C[^\\ ]+',
    long: '--context=[^\\ ]+',
    humanReadable: '-C, --context=NUM',
    help: 'print NUM lines of output context'
  },
  NUM: {
    short: '-NUM',
    humanReadable: '-NUM',
    help: 'same as --context=NUM'
  },
  colorWHEN: {
    long: '--color[=WHEN]',
    humanReadable: '--color[=WHEN]',
    help: ','
  },
  colourWHEN: {
    long: '--colour[=WHEN]',
    humanReadable: '--colour[=WHEN]',
    help: 'use markers to highlight the matching strings;\n' +
      "                            WHEN is 'always', 'never', or 'auto'"
  },
  binary: {
    short: '-U',
    long: '--binary',
    humanReadable: '-U, --binary',
    help: 'do not strip CR characters at EOL (MSDOS/Windows)'
  }
}
```

</p>
</details>

As you can see, the default output here is a typical `Javascript` content, you could just copy/paste.

You can also just `require` if you want :wink:

> **Note**
> In the above output, there is a parameter called `param`.

```js
param: {
  humanReadable: '',
  help: "TYPE is 'binary', 'text', or 'without-match'"
},
```

This parameter is invalid and will not be accepted when instantiating `Reargs` afterwards.

This is because the default RegExp is not perfect (and you can help me find a better suited one, feel free to PR !) and sometimes there are leftovers.

This is why you should always test what is produced by this tool, and we will get to that later on in this README.

### Changing output format

If you want to change the output, you have two other options :

* `json` for a minified JSON
* `pretty` for a prettyfied JSON

You can select using the `-o` option like :

```sh
$ grep --help | reargs -r -o json
```

But that is not all !

### Replacing parameter attribute with a customized RegExp

As you can see, there are several parameters having custom attributes, like `--context` or `--color`. So at some point we might want to specify the `RegExp` you want to map with these attributes.

By default `reargs` replaces every time there is a match with an attribute in CAPITAL letters with a default RegExp matching everything till the next space it founds.

You can change this behavior by setting the `-da="<your_own_regexp>"`.

Of course you can do it separately by finding/replacing in your favorite text editor, and if you do not want this, you just need to pass the `-nda` (or `--no-default-attribute` parameter).

If you want to do it using this tool, you can for instance :

```sh
$ grep --help | reargs -r -a NUM="[0-9]+"
```

Will replace each occurrence of **NUM** with this RegExp.

A more complete example would be like this one :

```sh
$ grep --help | reargs -r -a WHEN="(always|never|auto)",NUM="[0-9]+" -a ACTION="(read|recurse|skip)"
```

> **Note**
> Double quotes might not be necessary, it depends on your shell and how it handles these special characters (i.e. `[]` and `()`).

We can go a bit further by trying to *convert* some remarkable patterns to help designing the required RegExp.

For instance, let's take the parameter :

```
--color[=WHEN]
```

It can be interpreted as an optional attribute leaving `--color` as a possible acceptable input.

Now if you enable the switch `-c` (or `--convert`), then this parameter will have the following definition :

```js
{
  colourWHEN: {
    long: '--colour=?(?<WHEN>(always|never|auto))?',
    humanReadable: '--colour[=WHEN]',
    help: 'use markers to highlight the matching strings;\n' +
      "                            WHEN is 'always', 'never', or 'auto'"
  },
}
```

Pretty cool huh ? :wink:

### Using a different PATTERN to match

This tool is unfortunately not magic, or the magic happens thanks to a well written and battle tested Regular Expression.

At the moment the one that gives best result is this one :

```js
/^\ +(?<short>-[^-,\ ]+(?:\ [<\[]\w+[>\]])?)*(,?\ ?(?<long>--[^,\ ]+),?)*\ +(?<help>[^\n]+(?:\n[^-\n]+$)*)/gm
```

But sometimes it leaves some work to be done.

If you feel like doing some RegExp testing against your own patterns, you can use the following command, e.g. :

```sh
$ grep --help | reargs -r -p patterns.json
```

The file must be a JSON, a typical one would be :

```js
[
  "^\ +(?<short>-[^-,\ ]+(?:\ [<\[]\w+[>\]])?)*(,?\ ?(?<long>--[^,\ ]+),?)*\ +(?<help>[^\n]+(?:\n[^-\n]+$)*)",
]
```

Meaning an `Array` of `string`s being `RegExp`s.

Each one will be tested and the **best** one will serve as output.

So how do we know which one is the __best__ one ?

Internally, there is an object maintaining all computed parameter names, if they are found. These parameter names are built from either `short` or `long` discovered patterns. If none can be found, a default `param` is used.

The idea is therefore to minimize the number of undiscovered parameters :unicorn: each time by parsing the whole input.

## Generating help

Once you have your `JSON` or Plain `Javascript` source file, you can test outputting a typical `help` using `generateHelp` API from [Reargs](https://github.com/oorabona/reargs).

To do that, simply try this command :

```sh
$ reargs -f examples/grep.json gen help
```

<details>
<summary>Click here to show the typical (default template) generated help</summary>
<p>

```sh
Your app v0.0.0 - This description needs to be customized ! - by John Doe

Usage:
  Your app [_]


_s:

  -E, --extended-regexp         PATTERNS are extended regular expressions
  -F, --fixed-strings           PATTERNS are strings
  -G, --basic-regexp            PATTERNS are basic regular expressions
  -P, --perl-regexp             PATTERNS are Perl regular expressions
  -e, --regexp=PATTERNS         use PATTERNS for matching
  -f, --file=FILE               take PATTERNS from FILE
  -i, --ignore-case             ignore case distinctions in patterns and data
      --no-ignore-case          do not ignore case distinctions (default)
  -w, --word-regexp             match only whole words
  -x, --line-regexp             match only whole lines
  -z, --null-data               a data line ends in 0 byte, not newline
  -s, --no-messages             suppress error messages
  -v, --invert-match            select non-matching lines
  -V, --version                 display version information and exit
      --help                    display this help text and exit
  -m, --max-count=NUM           stop after NUM selected lines
  -b, --byte-offset             print the byte offset with output lines
  -n, --line-number             print line number with output lines
      --line-buffered           flush output on every line
  -H, --with-filename           print file name with output lines
  -h, --no-filename             suppress the file name prefix on output
      --label=LABEL             use LABEL as the standard input file name prefix
  -o, --only-matching           show only nonempty parts of lines that match
  -q, --silent                  suppress all normal output
      --binary-files=TYPE       assume that binary files are TYPE; TYPE is &#39;binary&#39;, &#39;text&#39;, or &#39;without-match&#39;
  -a, --text                    equivalent to --binary-files=text
  -I                            equivalent to --binary-files=without-match
  -d, --directories=ACTION      how to handle directories;
                            ACTION is &#39;read&#39;, &#39;recurse&#39;, or &#39;skip&#39;
  -D, --devices=ACTION          how to handle devices, FIFOs and sockets;
                            ACTION is &#39;read&#39; or &#39;skip&#39;
  -r, --recursive               like --directories=recurse
  -R, --dereference-recursive   likewise, but follow all symlinks
      --include=GLOB            search only files that match GLOB (a file pattern)
      --exclude=GLOB            skip files that match GLOB
      --exclude-from=FILE       skip files that match any file pattern from FILE
      --exclude-dir=GLOB        skip directories that match GLOB
  -L, --files-without-match     print only names of FILEs with no selected lines
  -l, --files-with-matches      print only names of FILEs with selected lines
  -c, --count                   print only a count of selected lines per FILE
  -T, --initial-tab             make tabs line up (if needed)
  -Z, --null                    print 0 byte after FILE name
  -B, --before-context=NUM      print NUM lines of leading context
  -A, --after-context=NUM       print NUM lines of trailing context
  -C, --context=NUM             print NUM lines of output context
  -NUM                          same as --context=NUM
      --color[=WHEN]            ,
      --colour[=WHEN]           use markers to highlight the matching strings;
                            WHEN is &#39;always&#39;, &#39;never&#39;, or &#39;auto&#39;
  -U, --binary                  do not strip CR characters at EOL (MSDOS/Windows)
```

</p>
</details>

> **NOTE**
> You can see escaped characters (e.g. `&#39`) because by default the template force output to be safe. And single quotes are not _safe_ per se.

Now if you want to customize this, simply create a template file, following [nunjucks](https://mozilla.github.io/nunjucks) templating capabilities.

Once you have your file, for example this [one](examples/grep.tpl), you can try it with :

```sh
$ reargs -f examples/grep.json -t examples/grep.tpl gen help
```

And see that autogenerated output :heart_eyes: :

<details>
<summary>Click here to show</summary>
<p>

```sh
Usage: grep [OPTION]... PATTERNS [FILE]...
Search for PATTERNS in each FILE.
Example: grep -i 'hello world' menu.h main.c
PATTERNS can contain multiple patterns separated by newlines.

OPTIONS:


  -E, --extended-regexp         PATTERNS are extended regular expressions
  -F, --fixed-strings           PATTERNS are strings
  -G, --basic-regexp            PATTERNS are basic regular expressions
  -P, --perl-regexp             PATTERNS are Perl regular expressions
  -e, --regexp=PATTERNS         use PATTERNS for matching
  -f, --file=FILE               take PATTERNS from FILE
  -i, --ignore-case             ignore case distinctions in patterns and data
      --no-ignore-case          do not ignore case distinctions (default)
  -w, --word-regexp             match only whole words
  -x, --line-regexp             match only whole lines
  -z, --null-data               a data line ends in 0 byte, not newline
  -s, --no-messages             suppress error messages
  -v, --invert-match            select non-matching lines
  -V, --version                 display version information and exit
      --help                    display this help text and exit
  -m, --max-count=NUM           stop after NUM selected lines
  -b, --byte-offset             print the byte offset with output lines
  -n, --line-number             print line number with output lines
      --line-buffered           flush output on every line
  -H, --with-filename           print file name with output lines
  -h, --no-filename             suppress the file name prefix on output
      --label=LABEL             use LABEL as the standard input file name prefix
  -o, --only-matching           show only nonempty parts of lines that match
  -q, --silent                  suppress all normal output
      --binary-files=TYPE       assume that binary files are TYPE; TYPE is &#39;binary&#39;, &#39;text&#39;, or &#39;without-match&#39;
  -a, --text                    equivalent to --binary-files=text
  -I                            equivalent to --binary-files=without-match
  -d, --directories=ACTION      how to handle directories;
                            ACTION is &#39;read&#39;, &#39;recurse&#39;, or &#39;skip&#39;
  -D, --devices=ACTION          how to handle devices, FIFOs and sockets;
                            ACTION is &#39;read&#39; or &#39;skip&#39;
  -r, --recursive               like --directories=recurse
  -R, --dereference-recursive   likewise, but follow all symlinks
      --include=GLOB            search only files that match GLOB (a file pattern)
      --exclude=GLOB            skip files that match GLOB
      --exclude-from=FILE       skip files that match any file pattern from FILE
      --exclude-dir=GLOB        skip directories that match GLOB
  -L, --files-without-match     print only names of FILEs with no selected lines
  -l, --files-with-matches      print only names of FILEs with selected lines
  -c, --count                   print only a count of selected lines per FILE
  -T, --initial-tab             make tabs line up (if needed)
  -Z, --null                    print 0 byte after FILE name
  -B, --before-context=NUM      print NUM lines of leading context
  -A, --after-context=NUM       print NUM lines of trailing context
  -C, --context=NUM             print NUM lines of output context
  -NUM                          same as --context=NUM
      --color[=WHEN]            ,
      --colour[=WHEN]           use markers to highlight the matching strings;
                            WHEN is &#39;always&#39;, &#39;never&#39;, or &#39;auto&#39;
  -U, --binary                  do not strip CR characters at EOL (MSDOS/Windows)


When FILE is '-', read standard input.  With no FILE, read '.' if
recursive, '-' otherwise.  With fewer than two FILEs, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report bugs to: bug-grep@gnu.org
GNU grep home page: <http://www.gnu.org/software/grep/>
General help using GNU software: <https://www.gnu.org/gethelp/>
```

</p>
</details>

Yay ! We are almost there. Feel free to play with this template engine to fit it to your needs.

### Testing

More important is to make sure your configuration is correct before even going to test in your own program.

To help you succesfully achieve that, you can use `test` command, and pass the command line parameters after `--` like in the example below:

```sh
$ reargs -f examples/grep.json test -- -z --help -U -34 -I
unparsable
values {
  extendedregexp: false,
  fixedstrings: false,
  basicregexp: false,
  perlregexp: false,
  regexpPATTERNS: false,
  fileFILE: false,
  ignorecase: false,
  noignorecase: false,
  wordregexp: false,
  lineregexp: false,
  nulldata: true,
  nomessages: false,
  invertmatch: false,
  version: false,
  help: true,
  maxcountNUM: false,
  byteoffset: false,
  linenumber: false,
  linebuffered: false,
  withfilename: false,
  nofilename: false,
  labelLABEL: false,
  onlymatching: false,
  silent: false,
  binaryfilesTYPE: false,
  text: false,
  I: true,
  directoriesACTION: false,
  devicesACTION: false,
  recursive: false,
  dereferencerecursive: false,
  includeGLOB: false,
  excludeGLOB: false,
  excludefromFILE: false,
  excludedirGLOB: false,
  fileswithoutmatch: false,
  fileswithmatches: false,
  count: false,
  initialtab: false,
  null: false,
  beforecontextNUM: false,
  aftercontextNUM: false,
  contextNUM: false,
  NUM: '34',
  colorWHEN: false,
  colourWHEN: false,
  binary: true
}
```

And you can play with it knowing that it will also support if you have `--` in your accepted parameters ! :wink:

## Contributing

Licence is [MIT](LICENSE), feel free to raise issues, provide PR or just drop a word about how you use it, what would be the next features you would like this piece of software to have.
