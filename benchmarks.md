# Benchmarks

You may run these benchmarks by installing Deno and running:

```sh
$ deno task fixtures <number of files per directory>
# enables access: fs read, env, system (for fs.access)
$ deno bench -RES
```

You can also find the benchmark results in the
[CI pipeline](https://github.com/lukeed/empathic/actions/workflows/ci.yml), as it runs **all**
benchmarks on **every** push and tag. Module size tracking is also logged on every CI run.

The results below are taken from my machine with **13 fixtures in each directory**. Please note that
GitHub Actions run on different hardware.

```
    CPU | Apple M1 Max
Runtime | Deno 2.3.6 (aarch64-apple-darwin)
```

A best-effort is made, wherever possible, to ensure fair comparison.

## find

### `find.up`

> Look for **one** target in N parent directories.<br> See [`find.any`](#findany) results for
> targetting **multiple** files.

_**Walk `6` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------- ----------------------------- --------------------- --------------------------
group level-6
find-up                          207.8 µs         4,812 (173.2 µs …   3.7 ms) 208.8 µs 393.1 µs 609.6 µs
find-up-simple                   156.0 µs         6,409 (137.5 µs …   1.1 ms) 157.8 µs 224.5 µs 241.3 µs
find-up-simple (sync)             71.9 µs        13,900 ( 66.3 µs … 291.8 µs)  72.0 µs  84.2 µs  88.9 µs
escalade                         235.4 µs         4,248 (221.6 µs … 397.5 µs) 238.5 µs 290.9 µs 298.8 µs
empathic/find.up (sync)            7.3 µs       137,800 (  7.1 µs …   7.6 µs)   7.4 µs   7.6 µs   7.6 µs

summary
  empathic/find.up (sync)
     9.91x faster than find-up-simple (sync)
    21.50x faster than find-up-simple
    28.64x faster than find-up
    32.44x faster than escalade
```

_**Walk `10` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------- ----------------------------- --------------------- --------------------------
find-up                          459.7 µs         2,175 (421.8 µs …   2.0 ms) 461.1 µs 547.8 µs   1.3 ms
find-up-simple                   374.7 µs         2,669 (340.2 µs …   1.7 ms) 383.1 µs 439.9 µs 458.6 µs
find-up-simple (sync)            187.8 µs         5,324 (182.3 µs … 456.3 µs) 188.8 µs 211.2 µs 217.5 µs
escalade                         511.4 µs         1,955 (438.9 µs … 816.5 µs) 514.9 µs 605.2 µs 702.7 µs
empathic/find.up (sync)           15.5 µs        64,410 ( 15.1 µs … 296.1 µs)  15.4 µs  18.1 µs  18.7 µs

summary
  empathic/find.up (sync)
    12.10x faster than find-up-simple (sync)
    24.13x faster than find-up-simple
    29.61x faster than find-up
    32.94x faster than escalade
```

_**Walk `15+` parent directories, never finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------- ----------------------------- --------------------- --------------------------
find-up                          632.0 µs         1,582 (582.1 µs …   2.7 ms) 630.4 µs 697.7 µs   1.3 ms
find-up-simple                   507.5 µs         1,970 (465.8 µs …   1.7 ms) 514.1 µs 648.5 µs 733.3 µs
find-up-simple (sync)            273.9 µs         3,651 (268.7 µs … 592.2 µs) 274.2 µs 291.3 µs 298.5 µs
escalade                         862.6 µs         1,159 (811.9 µs …   1.2 ms) 871.3 µs   1.1 ms   1.1 ms
empathic/find.up (sync)           20.5 µs        48,860 ( 19.9 µs … 314.6 µs)  20.4 µs  23.0 µs  24.0 µs

summary
  empathic/find.up (sync)
    13.38x faster than find-up-simple (sync)
    24.80x faster than find-up-simple
    30.88x faster than find-up
    42.15x faster than escalade
```

### `find.any`

> Look for **any** of the targets listed in N parent directories.<br> See [`find.up`](#findup)
> results for targetting **one** file.

_**Walk `6` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       112.8 µs         8,862 ( 83.2 µs …   3.6 ms) 113.2 µs 248.3 µs 277.5 µs
locate-path (sync)                105.3 µs         9,493 ( 97.8 µs … 442.1 µs) 105.9 µs 126.2 µs 133.8 µs
locate-path (order)               111.6 µs         8,959 ( 84.9 µs … 497.2 µs) 113.8 µs 152.5 µs 315.3 µs
find-up                             1.8 ms           545 (  1.7 ms …   2.3 ms)   1.8 ms   2.2 ms   2.2 ms
find-up (sync)                      1.9 ms           524 (  1.7 ms …   2.3 ms)   2.0 ms   2.2 ms   2.2 ms
escalade                          237.1 µs         4,219 (224.3 µs … 416.1 µs) 240.0 µs 287.7 µs 308.3 µs
empathic/find.any (sync)           48.4 µs        20,680 ( 47.4 µs … 255.0 µs)  48.1 µs  52.5 µs  55.2 µs

summary
  empathic/find.any (sync)
     2.18x faster than locate-path (sync)
     2.31x faster than locate-path (order)
     2.33x faster than locate-path
     4.90x faster than escalade
    37.89x faster than find-up
    39.41x faster than find-up (sync)
```

_**Walk `10` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       111.6 µs         8,960 ( 85.9 µs … 785.8 µs) 113.6 µs 148.4 µs 158.7 µs
locate-path (sync)                112.8 µs         8,865 (103.8 µs … 676.8 µs) 114.6 µs 132.0 µs 139.1 µs
locate-path (order)               111.1 µs         9,004 ( 87.0 µs … 776.6 µs) 113.5 µs 141.8 µs 151.1 µs
find-up                             1.9 ms           539 (  1.7 ms …   2.7 ms)   1.9 ms   2.5 ms   2.6 ms
find-up (sync)                      2.1 ms           478 (  2.0 ms …   2.8 ms)   2.1 ms   2.3 ms   2.5 ms
escalade                          512.7 µs         1,951 (490.3 µs … 742.4 µs) 518.1 µs 581.1 µs 642.0 µs
empathic/find.any (sync)          105.1 µs         9,514 (103.3 µs … 414.6 µs) 104.6 µs 111.8 µs 116.3 µs

summary
  empathic/find.any (sync)
     1.06x faster than locate-path (order)
     1.06x faster than locate-path
     1.07x faster than locate-path (sync)
     4.88x faster than escalade
    17.64x faster than find-up
    19.89x faster than find-up (sync)
```

_**Walk `15+` parent directories, never finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       111.0 µs         9,013 ( 87.8 µs … 797.2 µs) 112.9 µs 147.1 µs 156.2 µs
locate-path (sync)                118.0 µs         8,473 (114.6 µs … 877.2 µs) 118.2 µs 128.0 µs 132.4 µs
locate-path (order)               110.9 µs         9,021 ( 87.2 µs … 877.8 µs) 113.3 µs 143.3 µs 152.8 µs
find-up                             1.9 ms           519 (  1.7 ms …   6.4 ms)   1.9 ms   3.0 ms   3.2 ms
find-up (sync)                      2.3 ms           439 (  2.2 ms …   3.0 ms)   2.3 ms   2.7 ms   3.0 ms
escalade                          997.4 µs         1,003 (834.0 µs …   4.2 ms)   1.0 ms   2.3 ms   3.0 ms
empathic/find.any (sync)          135.4 µs         7,384 (131.0 µs … 410.4 µs) 134.9 µs 173.9 µs 202.0 µs

summary
  locate-path (order)
     1.00x faster than locate-path
     1.06x faster than locate-path (sync)
     1.22x faster than empathic/find.any (sync)
     9.00x faster than escalade
    17.37x faster than find-up
    20.53x faster than find-up (sync)
```

## package

### `package.up`

_**Find the nearest `package.json` file**_

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
package-up                          286.7 µs         3,488 (257.5 µs … 628.8 µs) 290.9 µs 347.4 µs 362.0 µs
package-up (sync)                   134.8 µs         7,417 (123.4 µs … 242.3 µs) 135.0 µs 164.3 µs 170.0 µs
pkg-up                              360.0 µs         2,778 (319.7 µs …   3.9 ms) 359.3 µs 693.2 µs 871.6 µs
pkg-up (sync)                       156.0 µs         6,409 (139.2 µs … 731.4 µs) 158.1 µs 175.6 µs 179.8 µs
empathic/package.up (sync)           12.5 µs        80,310 ( 12.1 µs … 216.2 µs)  12.4 µs  13.7 µs  15.2 µs

summary
  empathic/package.up (sync)
    10.83x faster than package-up (sync)
    12.53x faster than pkg-up (sync)
    23.02x faster than package-up
    28.91x faster than pkg-up
```

_**Get the directory path of the closest `package.json` file**_

> **Note:** `empathic/package.up` passes its output to
> [`path.dirname()`](https://nodejs.org/docs/latest/api/path.html#pathdirnamepath) for equality.

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
pkg-dir                             281.3 µs         3,556 (257.5 µs … 466.2 µs) 286.5 µs 317.8 µs 337.8 µs
pkg-dir (sync)                      137.5 µs         7,272 (128.9 µs … 296.8 µs) 138.2 µs 152.2 µs 160.8 µs
empathic/package.up (sync)           12.5 µs        80,220 ( 12.1 µs … 218.5 µs)  12.4 µs  14.0 µs  15.1 µs

summary
  empathic/package.up (sync)
    11.03x faster than pkg-dir (sync)
    22.56x faster than pkg-dir
```

### `package.cache`

_**Construct a `node_modules/.cache/<name>` directory for a package**_

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
find-cache-dir                      192.7 µs         5,190 (182.3 µs … 367.0 µs) 194.3 µs 207.9 µs 218.9 µs
empathic/package.cache               17.6 µs        56,920 ( 17.1 µs … 237.6 µs)  17.5 µs  20.1 µs  20.4 µs

summary
  empathic/package.cache
    10.97x faster than find-cache-dir
```

## resolve

### `resolve.from`

> Emulate `require.resolve` from a starting directory

```
file:///.../empathic/src/resolve.bench.ts

benchmark               time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------- ----------------------------- --------------------- --------------------------
resolve-from                    36.9 µs        27,130 ( 35.6 µs … 213.0 µs)  36.8 µs  42.3 µs  46.1 µs
empathic/resolve.from           27.7 µs        36,100 ( 26.5 µs … 275.9 µs)  27.7 µs  31.5 µs  35.0 µs

summary
  empathic/resolve.from
     1.33x faster than resolve-from
```

### `resolve.cwd`

> Emulate `require.resolve` from the current working directory

```
file:///.../empathic/src/resolve.bench.ts

benchmark               time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------- ----------------------------- --------------------- --------------------------
resolve-cwd                     36.8 µs        27,160 ( 35.9 µs … 161.5 µs)  36.8 µs  41.5 µs  44.3 µs
empathic/resolve.cwd            32.2 µs        31,030 ( 31.3 µs … 205.8 µs)  32.2 µs  35.8 µs  38.5 µs

summary
  empathic/resolve.cwd
     1.14x faster than resolve-cwd
```

## walk

```
file:///.../empathic/src/walk.bench.ts

benchmark              time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------- ----------------------------- --------------------- --------------------------
empathic/walk.up                8.0 µs       125,300 (  7.5 µs …  61.5 µs)   7.8 µs   9.4 µs  33.3 µs
```
