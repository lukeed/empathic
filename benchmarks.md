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
Runtime | Deno 1.46.2 (aarch64-apple-darwin)
```

A best-effort is made, wherever possible, to ensure fair comparison.

## find

### `find.up`

> Look for **one** target in N parent directories.<br> See [`find.any`](#findany) results for
> targetting **multiple** files.

_**Walk `6` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark               time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------- ----------------------------- --------------------- --------------------------
find-up                        189.1 µs         5,289 (161.9 µs …   3.4 ms) 188.8 µs 367.2 µs 628.3 µs
find-up-simple                 141.7 µs         7,059 (128.4 µs … 723.9 µs) 144.3 µs 161.0 µs 171.5 µs
find-up-simple (sync)           66.5 µs        15,050 ( 62.5 µs … 282.4 µs)  66.4 µs  74.2 µs  84.2 µs
escalade                       231.6 µs         4,317 (217.8 µs … 519.1 µs) 233.7 µs 278.8 µs 305.8 µs
find.up (sync)                   7.0 µs       143,300 (  6.9 µs …   7.0 µs)   7.0 µs   7.0 µs   7.0 µs

summary
  find.up (sync)
     9.53x faster than find-up-simple (sync)
    20.30x faster than find-up-simple
    27.10x faster than find-up
    30.08x faster than find.up (alt)
    33.20x faster than escalade
```

_**Walk `10` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark               time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------- ----------------------------- --------------------- --------------------------
find-up                        431.9 µs         2,315 (390.6 µs …   2.8 ms) 432.0 µs 522.8 µs   1.3 ms
find-up-simple                 351.0 µs         2,849 (321.7 µs …   1.5 ms) 355.5 µs 380.0 µs 410.0 µs
find-up-simple (sync)          173.0 µs         5,781 (168.5 µs … 525.9 µs) 173.9 µs 188.9 µs 207.0 µs
escalade                       497.9 µs         2,009 (477.0 µs … 869.6 µs) 501.3 µs 546.4 µs 565.7 µs
find.up (sync)                  14.9 µs        67,020 ( 14.7 µs … 361.1 µs)  14.9 µs  15.5 µs  15.8 µs

summary
  find.up (sync)
    11.59x faster than find-up-simple (sync)
    23.52x faster than find-up-simple
    28.94x faster than find-up
    31.86x faster than find.up (alt)
    33.37x faster than escalade
```

_**Walk `15+` parent directories, never finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark               time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------- ----------------------------- --------------------- --------------------------
find-up                        592.7 µs         1,687 (553.1 µs …   2.2 ms) 591.2 µs 648.0 µs   1.5 ms
find-up-simple                 477.2 µs         2,095 (446.4 µs …   1.9 ms) 480.0 µs 511.5 µs 521.8 µs
find-up-simple (sync)          256.4 µs         3,900 (251.0 µs … 610.8 µs) 256.4 µs 283.3 µs 305.0 µs
escalade                       833.7 µs         1,199 (800.3 µs …   1.2 ms) 839.2 µs 970.8 µs   1.1 ms
find.up (sync)                  19.6 µs        51,050 ( 19.2 µs … 427.3 µs)  19.5 µs  20.7 µs  22.4 µs

summary
  find.up (sync)
    13.09x faster than find-up-simple (sync)
    24.36x faster than find-up-simple
    30.26x faster than find-up
    41.02x faster than find.up (alt)
    42.56x faster than escalade
```

### `find.any`

> Look for **any** of the targets listed in N parent directories.<br> See [`find.up`](#findup)
> results for targetting **one** file.

_**Walk `6` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  106.8 µs         9,363 ( 78.7 µs …   3.1 ms) 107.6 µs 243.7 µs 282.2 µs
locate-path (sync)            98.4 µs        10,170 ( 90.2 µs … 374.5 µs)  99.0 µs 116.0 µs 127.8 µs
locate-path (order)          106.1 µs         9,424 ( 77.3 µs … 983.8 µs) 108.4 µs 147.5 µs 313.4 µs
find-up                        1.7 ms           571 (  1.6 ms …   2.2 ms)   1.7 ms   2.1 ms   2.1 ms
find-up (sync)                 1.8 ms           552 (  1.5 ms …   2.2 ms)   1.9 ms   2.1 ms   2.1 ms
escalade                     235.8 µs         4,242 (220.4 µs … 483.5 µs) 237.5 µs 313.0 µs 361.0 µs
find.any (sync)               47.3 µs        21,160 ( 46.2 µs … 301.9 µs)  47.0 µs  52.5 µs  58.7 µs

summary
  find.any (sync)
     2.08x faster than locate-path (sync)
     2.25x faster than locate-path (order)
     2.26x faster than locate-path
     4.99x faster than escalade
    37.02x faster than find-up
    38.33x faster than find-up (sync)
```

_**Walk `10` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  106.8 µs         9,361 ( 80.2 µs …   1.8 ms) 108.6 µs 139.9 µs 151.6 µs
locate-path (sync)           105.6 µs         9,471 ( 97.2 µs … 744.1 µs) 110.2 µs 119.5 µs 123.3 µs
locate-path (order)          105.7 µs         9,459 ( 80.9 µs … 801.0 µs) 108.5 µs 136.0 µs 146.1 µs
find-up                        1.8 ms           562 (  1.6 ms …   2.5 ms)   1.8 ms   2.4 ms   2.4 ms
find-up (sync)                 2.0 ms           502 (  1.9 ms …   2.5 ms)   2.0 ms   2.2 ms   2.5 ms
escalade                     501.9 µs         1,993 (479.8 µs … 733.2 µs) 505.6 µs 570.6 µs 584.2 µs
find.any (sync)              102.3 µs         9,770 (101.0 µs … 402.4 µs) 101.9 µs 108.6 µs 116.1 µs

summary
  find.any (sync)
     1.03x faster than locate-path (sync)
     1.03x faster than locate-path (order)
     1.04x faster than locate-path
     4.90x faster than escalade
    17.39x faster than find-up
    19.44x faster than find-up (sync)
```

_**Walk `15+` parent directories, never finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  106.1 µs         9,426 ( 83.0 µs … 770.5 µs) 108.3 µs 138.5 µs 151.0 µs
locate-path (sync)           111.9 µs         8,934 (108.3 µs … 740.8 µs) 112.4 µs 123.8 µs 127.5 µs
locate-path (order)          105.6 µs         9,472 ( 81.9 µs … 807.8 µs) 108.3 µs 137.0 µs 151.5 µs
find-up                        1.8 ms           565 (  1.7 ms …   2.6 ms)   1.8 ms   2.5 ms   2.5 ms
find-up (sync)                 2.1 ms           468 (  2.1 ms …   3.0 ms)   2.1 ms   2.4 ms   2.7 ms
escalade                     841.7 µs         1,188 (805.0 µs …   1.1 ms) 848.8 µs 989.9 µs   1.1 ms
find.any (sync)              130.1 µs         7,684 (128.1 µs … 447.2 µs) 129.5 µs 137.2 µs 146.2 µs

summary
  locate-path (order)
     1.00x faster than locate-path
     1.06x faster than locate-path (sync)
     1.23x faster than find.any (sync)
     7.97x faster than escalade
    16.75x faster than find-up
    20.22x faster than find-up (sync)
```

## package

### `package.up`

_**Find the nearest `package.json` file**_

```
file:///.../empathic/src/package.bench.ts

benchmark           time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------- ----------------------------- --------------------- --------------------------
package-up                 237.0 µs         4,220 (217.3 µs …   2.4 ms) 241.0 µs 320.0 µs 342.7 µs
package-up (sync)          116.9 µs         8,555 ( 88.7 µs … 242.3 µs) 124.0 µs 145.2 µs 169.9 µs
pkg-up                     316.9 µs         3,155 (268.5 µs …   3.0 ms) 312.7 µs 751.1 µs 855.2 µs
pkg-up (sync)              140.8 µs         7,105 (113.0 µs … 525.6 µs) 141.8 µs 155.2 µs 162.6 µs
package.up (sync)           13.5 µs        74,320 ( 13.0 µs … 251.8 µs)  13.3 µs  15.1 µs  15.7 µs

summary
  package.up (sync)
     8.69x faster than package-up (sync)
    10.46x faster than pkg-up (sync)
    17.61x faster than package-up
    23.55x faster than pkg-up
```

_**Get the directory path of the closest `package.json` file**_

> **Note:** `package.up` passes its output to
> [`path.dirname()`](https://nodejs.org/docs/latest/api/path.html#pathdirnamepath) for equality.

```
file:///.../empathic/src/package.bench.ts

benchmark           time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------- ----------------------------- --------------------- --------------------------
pkg-dir                    232.3 µs         4,305 (213.8 µs … 537.5 µs) 233.5 µs 316.3 µs 340.8 µs
pkg-dir (sync)             122.1 µs         8,188 (105.8 µs … 504.2 µs) 129.0 µs 133.0 µs 141.7 µs
package.up (sync)           13.5 µs        74,140 ( 13.1 µs … 252.8 µs)  13.4 µs  14.7 µs  15.1 µs

summary
  package.up (sync)
     9.05x faster than pkg-dir (sync)
    17.22x faster than pkg-dir
```

### `package.cache`

_**Construct a `node_modules/.cache/<name>` directory for a package**_

```
file:///.../empathic/src/package.bench.ts

benchmark           time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------- ----------------------------- --------------------- --------------------------
find-cache-dir             177.4 µs         5,638 (171.1 µs … 366.7 µs) 176.3 µs 194.5 µs 214.8 µs
package.cache               17.9 µs        55,930 ( 17.4 µs … 271.5 µs)  17.7 µs  20.8 µs  21.8 µs

summary
  package.cache
     9.92x faster than find-cache-dir
```

## resolve

### `resolve.from`

> Emulate `require.resolve` from a starting directory

```
file:///.../empathic/src/resolve.bench.ts

benchmark      time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------- ----------------------------- --------------------- --------------------------
resolve-from           38.7 µs        25,810 ( 37.6 µs … 262.6 µs)  39.2 µs  43.0 µs  43.9 µs
resolve.from           31.4 µs        31,860 ( 30.0 µs … 297.9 µs)  32.0 µs  35.7 µs  38.7 µs

summary
  resolve.from
     1.23x faster than resolve-from
```

### `resolve.cwd`

> Emulate `require.resolve` from the current working directory

```
file:///.../empathic/src/resolve.bench.ts

benchmark      time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------- ----------------------------- --------------------- --------------------------
resolve-cwd            35.1 µs        28,500 ( 34.2 µs … 250.9 µs)  35.3 µs  39.0 µs  40.3 µs
resolve.cwd            32.1 µs        31,160 ( 30.8 µs … 311.1 µs)  32.1 µs  37.5 µs  41.3 µs

summary
  resolve.cwd
     1.09x faster than resolve-cwd
```

## walk

```
file:///.../empathic/src/walk.bench.ts

benchmark              time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------- ----------------------------- --------------------- --------------------------
walk.up                         7.6 µs       132,100 (  7.3 µs … 224.8 µs)   7.5 µs   8.5 µs   9.3 µs
```
