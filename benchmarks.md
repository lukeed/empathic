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
Runtime | Deno 2.2.12 (aarch64-apple-darwin)
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
find-up                          191.4 µs         5,223 (165.6 µs …   3.7 ms) 190.8 µs 359.9 µs 564.5 µs
find-up-simple                   142.1 µs         7,038 (129.5 µs …   1.0 ms) 144.5 µs 166.2 µs 178.1 µs
find-up-simple (sync)             67.8 µs        14,750 ( 64.5 µs … 290.1 µs)  67.4 µs  77.3 µs  83.3 µs
escalade                         231.8 µs         4,314 (219.3 µs … 382.5 µs) 233.8 µs 274.5 µs 293.8 µs
empathic/find.up (sync)            7.0 µs       142,200 (  7.0 µs …   7.1 µs)   7.0 µs   7.1 µs   7.1 µs

summary
  empathic/find.up (sync)
     9.64x faster than find-up-simple (sync)
    20.21x faster than find-up-simple
    27.23x faster than find-up
    32.97x faster than escalade
```

_**Walk `10` parent directories before finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------- ----------------------------- --------------------- --------------------------
find-up                          435.2 µs         2,298 (396.8 µs …   2.9 ms) 432.9 µs 572.1 µs   1.3 ms
find-up-simple                   353.0 µs         2,833 (325.7 µs …   1.6 ms) 357.5 µs 401.1 µs 430.0 µs
find-up-simple (sync)            175.7 µs         5,691 (170.3 µs … 498.9 µs) 176.8 µs 195.1 µs 204.4 µs
escalade                         503.2 µs         1,987 (477.3 µs … 796.6 µs) 506.1 µs 578.8 µs 653.8 µs
empathic/find.up (sync)           15.1 µs        66,280 ( 14.8 µs … 370.8 µs)  15.0 µs  16.0 µs  17.6 µs

summary
  empathic/find.up (sync)
    11.65x faster than find-up-simple (sync)
    23.40x faster than find-up-simple
    28.84x faster than find-up
    33.35x faster than escalade
```

_**Walk `15+` parent directories, never finding the `one` target**_

```
file:///.../empathic/src/find.bench.ts

benchmark                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------- ----------------------------- --------------------- --------------------------
find-up                          596.4 µs         1,677 (552.9 µs …   2.6 ms) 592.3 µs 665.1 µs   1.7 ms
find-up-simple                   478.6 µs         2,090 (445.5 µs …   1.8 ms) 481.8 µs 520.2 µs 536.9 µs
find-up-simple (sync)            255.3 µs         3,917 (251.3 µs … 606.4 µs) 255.2 µs 272.4 µs 287.1 µs
escalade                         829.7 µs         1,205 (804.9 µs …   1.2 ms) 833.9 µs 944.8 µs   1.1 ms
empathic/find.up (sync)           19.5 µs        51,350 ( 19.1 µs … 451.0 µs)  19.3 µs  20.5 µs  21.8 µs

summary
  empathic/find.up (sync)
    13.11x faster than find-up-simple (sync)
    24.58x faster than find-up-simple
    30.62x faster than find-up
    42.61x faster than escalade
```

### `find.any`

> Look for **any** of the targets listed in N parent directories.<br> See [`find.up`](#findup)
> results for targetting **one** file.

_**Walk `6` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       107.9 µs         9,266 ( 79.4 µs …   3.0 ms) 108.0 µs 246.5 µs 293.6 µs
locate-path (sync)                 99.4 µs        10,060 ( 88.3 µs … 456.4 µs) 100.7 µs 112.5 µs 119.7 µs
locate-path (order)               107.1 µs         9,338 ( 81.7 µs …   1.0 ms) 109.1 µs 144.9 µs 303.7 µs
find-up                             1.8 ms           569 (  1.6 ms …   2.3 ms)   1.8 ms   2.2 ms   2.2 ms
find-up (sync)                      1.8 ms           547 (  1.5 ms …   2.2 ms)   2.0 ms   2.1 ms   2.1 ms
escalade                          234.6 µs         4,263 (222.3 µs … 396.8 µs) 237.2 µs 290.1 µs 315.0 µs
empathic/find.any (sync)           48.3 µs        20,690 ( 46.5 µs …   1.0 ms)  47.2 µs  61.5 µs 134.4 µs

summary
  empathic/find.any (sync)
     2.06x faster than locate-path (sync)
     2.22x faster than locate-path (order)
     2.23x faster than locate-path
     4.85x faster than escalade
    36.37x faster than find-up
    37.82x faster than find-up (sync)
```

_**Walk `10` parent directories before finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       108.0 µs         9,260 ( 83.4 µs …   2.0 ms) 109.5 µs 144.2 µs 154.7 µs
locate-path (sync)                106.7 µs         9,376 ( 98.6 µs … 814.2 µs) 111.5 µs 119.0 µs 122.9 µs
locate-path (order)               106.3 µs         9,406 ( 82.0 µs … 770.7 µs) 108.9 µs 135.4 µs 149.1 µs
find-up                             1.8 ms           561 (  1.7 ms …   2.5 ms)   1.8 ms   2.5 ms   2.5 ms
find-up (sync)                      2.0 ms           497 (  2.0 ms …   2.7 ms)   2.0 ms   2.2 ms   2.5 ms
escalade                          503.5 µs         1,986 (481.2 µs … 824.8 µs) 507.8 µs 560.5 µs 590.1 µs
empathic/find.any (sync)          102.7 µs         9,736 (100.9 µs … 363.5 µs) 102.0 µs 110.9 µs 116.9 µs

summary
  empathic/find.any (sync)
     1.03x faster than locate-path (order)
     1.04x faster than locate-path (sync)
     1.05x faster than locate-path
     4.90x faster than escalade
    17.35x faster than find-up
    19.57x faster than find-up (sync)
```

_**Walk `15+` parent directories, never finding **any of** the targets**_

```
file:///.../empathic/src/locate.bench.ts

benchmark                  time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------- ----------------------------- --------------------- --------------------------
locate-path                       106.3 µs         9,404 ( 81.0 µs … 791.4 µs) 108.2 µs 144.5 µs 153.9 µs
locate-path (sync)                112.3 µs         8,903 (109.1 µs … 902.2 µs) 112.5 µs 125.8 µs 128.5 µs
locate-path (order)               105.6 µs         9,472 ( 81.5 µs … 935.8 µs) 108.4 µs 138.2 µs 149.6 µs
find-up                             1.8 ms           565 (  1.6 ms …   2.6 ms)   1.8 ms   2.5 ms   2.5 ms
find-up (sync)                      2.1 ms           469 (  2.1 ms …   3.0 ms)   2.1 ms   2.4 ms   2.6 ms
escalade                          843.2 µs         1,186 (812.8 µs …   1.1 ms) 848.8 µs 946.2 µs   1.0 ms
empathic/find.any (sync)          129.6 µs         7,718 (128.0 µs … 434.0 µs) 129.0 µs 139.5 µs 145.1 µs

summary
  locate-path (order)
     1.01x faster than locate-path
     1.06x faster than locate-path (sync)
     1.23x faster than empathic/find.any (sync)
     7.99x faster than escalade
    16.74x faster than find-up
    20.17x faster than find-up (sync)
```

## package

### `package.up`

_**Find the nearest `package.json` file**_

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
package-up                          271.4 µs         3,684 (249.6 µs … 414.1 µs) 277.3 µs 333.9 µs 365.2 µs
package-up (sync)                   132.6 µs         7,542 (123.0 µs … 245.0 µs) 132.5 µs 162.9 µs 168.1 µs
pkg-up                              354.2 µs         2,823 (311.0 µs …   3.6 ms) 353.1 µs 699.5 µs 793.8 µs
pkg-up (sync)                       157.8 µs         6,337 (136.4 µs … 847.5 µs) 159.9 µs 176.3 µs 187.9 µs
empathic/package.up (sync)           14.6 µs        68,280 ( 14.3 µs … 200.4 µs)  14.5 µs  15.8 µs  16.4 µs

summary
  empathic/package.up (sync)
     9.05x faster than package-up (sync)
    10.77x faster than pkg-up (sync)
    18.53x faster than package-up
    24.18x faster than pkg-up
```

_**Get the directory path of the closest `package.json` file**_

> **Note:** `empathic/package.up` passes its output to
> [`path.dirname()`](https://nodejs.org/docs/latest/api/path.html#pathdirnamepath) for equality.

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
pkg-dir                             266.2 µs         3,756 (249.2 µs … 488.3 µs) 269.6 µs 298.4 µs 337.0 µs
pkg-dir (sync)                      135.4 µs         7,383 (127.5 µs … 297.2 µs) 135.6 µs 149.5 µs 155.3 µs
empathic/package.up (sync)           14.7 µs        68,080 ( 14.4 µs … 221.5 µs)  14.6 µs  15.8 µs  16.7 µs

summary
  empathic/package.up (sync)
     9.22x faster than pkg-dir (sync)
    18.12x faster than pkg-dir
```

### `package.cache`

_**Construct a `node_modules/.cache/<name>` directory for a package**_

```
file:///.../empathic/src/package.bench.ts

benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------
find-cache-dir                      194.6 µs         5,138 (182.8 µs … 396.2 µs) 195.9 µs 208.5 µs 223.0 µs
empathic/package.cache               20.0 µs        50,110 ( 19.5 µs … 227.3 µs)  19.8 µs  21.5 µs  23.9 µs

summary
  empathic/package.cache
     9.75x faster than find-cache-dir
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
empathic/walk.up                8.1 µs       122,900 (  7.9 µs …  60.3 µs)   8.1 µs   8.8 µs  10.3 µs
```
