# Benchmarks

You may run these benchmarks by installing Deno and running:

```sh
$ deno task fixtures <number of files per directory>
# enables access: fs read, env, system (for fs.access)
$ deno bench -RES
```

You can also find the benchmark results in the [CI pipeline](/actions/workflows/ci.yml), as it runs
**all** benchmarks on **every** push and tag. Module size tracking is also logged on every CI run.

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

benchmark        time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------- ----------------------------- --------------------- --------------------------
find-up                 180.8 µs         5,532 (148.6 µs …   2.7 ms) 184.5 µs 435.1 µs 620.7 µs
find-up-simple          138.3 µs         7,233 (116.8 µs … 694.2 µs) 141.3 µs 257.0 µs 281.2 µs
escalade                226.6 µs         4,413 (192.0 µs …   2.9 ms) 224.5 µs 327.8 µs 780.0 µs
find.up (sync)            8.1 µs       124,000 (  8.0 µs …   8.3 µs)   8.1 µs   8.3 µs   8.3 µs

summary
  find.up (sync)
    17.14x faster than find-up-simple
    22.41x faster than find-up
    28.09x faster than escalade
```

_**Walk `10` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark        time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------- ----------------------------- --------------------- --------------------------
find-up                 428.7 µs         2,333 (359.7 µs …   3.0 ms) 410.9 µs 946.1 µs   2.1 ms
find-up-simple          319.8 µs         3,127 (290.8 µs … 774.7 µs) 328.0 µs 412.9 µs 490.7 µs
escalade                490.9 µs         2,037 (425.8 µs …   3.4 ms) 482.4 µs   1.1 ms   1.3 ms
find.up (sync)           16.5 µs        60,730 ( 15.8 µs … 637.6 µs)  16.0 µs  40.0 µs  40.6 µs

summary
  find.up (sync)
    19.42x faster than find-up-simple
    26.04x faster than find-up
    29.81x faster than escalade
```

_**Walk `15+` parent directories, never finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark        time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------- ----------------------------- --------------------- --------------------------
find-up                 579.8 µs         1,725 (512.8 µs …   3.2 ms) 574.4 µs   1.1 ms   1.2 ms
find-up-simple          457.2 µs         2,187 (399.5 µs …   2.4 ms) 451.0 µs 924.9 µs   1.4 ms
escalade                916.1 µs         1,092 (809.5 µs …   3.7 ms) 874.1 µs   3.4 ms   3.6 ms
find.up (sync)           20.5 µs        48,850 ( 19.5 µs … 664.3 µs)  20.0 µs  43.8 µs  44.8 µs

summary
  find.up (sync)
    22.33x faster than find-up-simple
    28.32x faster than find-up
    44.75x faster than escalade
```

### `find.any`

> Look for **any** of the targets listed in N parent directories.<br> See [`find.up`](#findup)
> results for targetting **one** file.

_**Walk `6` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  118.6 µs         8,434 ( 75.0 µs …  10.2 ms) 106.6 µs 302.2 µs 375.6 µs
locate-path (order)          121.2 µs         8,250 ( 73.3 µs …  12.9 ms) 104.6 µs 314.0 µs 398.7 µs
find-up                        2.0 ms         509.2 (  1.5 ms …  12.5 ms)   1.9 ms   4.4 ms   6.1 ms
find-up (sync)                 1.7 ms         583.7 (  1.3 ms …   2.1 ms)   1.7 ms   1.9 ms   1.9 ms
escalade                     226.0 µs         4,425 (196.7 µs …   3.3 ms) 222.8 µs 305.0 µs 722.4 µs
find.any (sync)               53.2 µs        18,790 ( 52.1 µs … 550.5 µs)  52.6 µs  59.8 µs  62.9 µs

summary
  find.any (sync)
     2.23x faster than locate-path
     2.28x faster than locate-path (order)
     4.25x faster than escalade
    32.20x faster than find-up (sync)
    36.91x faster than find-up
```

_**Walk `10` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  118.5 µs         8,440 ( 83.1 µs …   3.3 ms) 110.2 µs 236.6 µs 378.8 µs
locate-path (order)          122.3 µs         8,175 ( 79.5 µs …  19.3 ms) 108.8 µs 317.4 µs 396.5 µs
find-up                        2.1 ms         473.3 (  1.6 ms …  21.8 ms)   2.0 ms   4.5 ms  20.2 ms
find-up (sync)                 2.0 ms         512.0 (  1.9 ms …   2.2 ms)   2.0 ms   2.1 ms   2.1 ms
escalade                     497.0 µs         2,012 (434.5 µs …   3.6 ms) 482.6 µs   1.1 ms   3.1 ms
find.any (sync)              109.5 µs         9,136 (107.9 µs … 669.5 µs) 108.5 µs 116.6 µs 194.1 µs

summary
  find.any (sync)
     1.08x faster than locate-path
     1.12x faster than locate-path (order)
     4.54x faster than escalade
    17.84x faster than find-up (sync)
    19.30x faster than find-up
```

_**Walk `15+` parent directories, never finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------- ----------------------------- --------------------- --------------------------
locate-path                  131.0 µs         7,634 ( 82.2 µs …  20.1 ms) 109.6 µs 348.5 µs 444.5 µs
locate-path (order)          117.1 µs         8,538 ( 83.9 µs …   2.3 ms) 108.8 µs 326.0 µs 370.2 µs
find-up                        2.0 ms         500.0 (  1.6 ms …   6.9 ms)   2.0 ms   3.2 ms   4.4 ms
find-up (sync)                 2.1 ms         482.2 (  2.1 ms …   2.4 ms)   2.1 ms   2.2 ms   2.2 ms
escalade                     920.2 µs         1,087 (815.8 µs …   3.7 ms) 877.1 µs   3.4 ms   3.5 ms
find.any (sync)              134.0 µs         7,460 (132.2 µs … 703.1 µs) 132.9 µs 145.0 µs 217.1 µs

summary
  locate-path (order)
     1.12x faster than locate-path
     1.14x faster than find.any (sync)
     7.86x faster than escalade
    17.08x faster than find-up
    17.71x faster than find-up (sync)
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
