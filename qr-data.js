/* WebDev Lab — precomputed QR matrices for certificate verify URLs.
   Generated offline with segno (error level M) — see
   site-gen/cert-verify/build_qr_data.py. Each entry is { n: modules
   per side, d: base64 of the bit-packed matrix, row-major, MSB first }.
   URL for an ID: https://usmankalera-dev.github.io/webdev-lab/verify.html?id=<ID>
   Works in the browser (globals) and in Node (module.exports). */
(function (root) {
  "use strict";

  var QR = {
    "WDL-WEB-1001":{"n":37,"d":"/h02o/wU6rVQbrDH5Lt17Lm126apEK7BFJVVB/qqqq/gHsNgAILdOdZ0xHBghorukw/PKkcEfZM66ZigmKv9/qJsHzL3KiENIyzaBpCvqusBUYqj89NP00jEMhqUI/UmbiZg2ZhSnoSRx369cwd76tPrSx4sRDDqJPQZB0ci8lQM23nMPPoAefmEQ/hkfyowSd4DEboRgL+10YVP8W6TY6wfBCxEXZ/t2Yj0gA"},
    "WDL-WEB-1002":{"n":37,"d":"/ra2o/wQ67FQbr1RPrt0m+zl26WEpi7BcIUVB/qqqq/gC4dwAKNj4rkqKPU109WBJdSia2dFeYEr6ZignK/tv6fbVF9B/rhYdnlrHkvCHu7QVZrjs9NP0mvUcx6A+ZiQtTY1jM0HONf8ca+8dxc6LjnrSxgllTT6e/+v3CoRlwFZjaOhivkAX+nER/v8fyowQBoTELpDW9+F0dAapC6+13dzBCwlWY/s2Yj0gA"},
    "WDL-WEB-1003":{"n":37,"d":"/gc2o/wU7rVQbran5Lt1zLm126KpEK7BBJVVB/qqqq/gGoNgAIL3OdZ1zWBghobskw/PClcEfZEq6ZigmKv9/qJsjzL3O6XNIywG6pCvqE8BUYqnl9NP0yrEMhqUM/UmbmJi2ZhRnwSRx2ex8wd7ehnrSx8sVDDqLJIZB0dj4lQM2WnMPPoAe/mEQ/j0fyowSV4DEboTgL+10IVP8W6TY6wfBCxkXZ/s2Yj0gA"},
    "WDL-WEB-1004":{"n":37,"d":"/g22o/wU7rVQbrTn5Lt1zLm126bpEK7BBpVVB/qqqq/gGkNgAIKbOdZ0RTBghoqOkw/PC0cEfZE66Zig3Iv9/qJMBzL3I6GNIywW5pCvqUYRUYqv1dNP02rEMhqUMvUmbmZC2ZhSjgyRx3e18wd7qlXrSx4JVDDqILYZB0cj8lQM2XnMPPoAefmEQ/lkfyowQZ4DEbo9gL+10dVP8W6VYawfBDxUXZ/t2Yj0gA"},
    "WDL-WEB-1005":{"n":37,"d":"/jw2o/wUqrVQbrKn5Lt1zrm126KpEK7BNpVVB/qqqq/gGkNgAIK5OdZ25fBghoKOkw/PamcEfZE76ZigmIv9/qJNBzL3M6lNIywWpJCvq+eBUYqr8dNP0yvEMhqWI/UmbmZA2ZhRnwSRx2+5cwd7/nXrSx0A1DDqLLYZB0cA0lQM22jMPPoAWfmEQ/hsfyowSd4DEbpbgL+10dVP8W6VY6wfBCxUXZ/t2Yj0gA"},
    "WDL-WEB-1006":{"n":37,"d":"/qFty/wUOfhQbonqUrt1K6XF26dfy67BAMwxB/qqqq/gHU5UALdcjwpcizwRQau6SGJ4uQ5h68XxhC57jsbJLe0pIemalTk85DB+0f0Zdat0x9Pw3GWUvkHw4VeptC5L2L4xHoQjXOEnHBec5V4eVykwJqotl33e3ot0sZ0TJUh9ECR65/+AbaDkV/svEqrwUlM3ErpSNm/d18k+Nm6jusGpBGURy8/vtD4vgA"},
    "WDL-WEB-1007":{"n":37,"d":"/qY2o/wQ77FQbrlxPrt0u+zl26XEpi7BYoUVB/qqqq/gDwdwAKMl4rkqqbU109XhJdSiSmdFeYMr6Zig2I/tv6f7TF9B9zjYdnmn/kvCHUPAVZrvldNP0knUcx6A6JiQtXYXjM0HKF/8caa09xc6br/rSxgAhTT6f72v3CoQlwFZj6OhivkAX+nER/r8fyowSFoTELpvW9+F0YAapC641XdzBDw1WY/s2Yj0gA"},
    "WDL-WEB-1008":{"n":37,"d":"/udxu/wQUnZQbpyfBrt1emLV266Y167BVpllB/qqqq/gFb+TAIvyJafPpJTyz6nGq+xAUYTLQWL89eln7GrxzmJtZLzP1TIglff/o4zea0vhkoaX9F13MBAX/SZjPoThckLQkLzCvu8f/4S6T/S0aiwsV22g9PPmD/wh5MhpVI9hbHS9+/4AWPW0Q/tUnKoQQiLxHrq0nM/10SHduG6bWU+RBO+LYW/qxPkzgA"},
    "WDL-WEB-1009":{"n":37,"d":"/qc2o/wQZ7FQbrlRPrt0m+zl26XEpi7BYYUVB/qqqq/gC4dwAKMh4rkqCCU109mlJdSiCEdFeYM66Zig2K3tv6XqXF9B5rTYdnnjkEvCHuYAVZrrs9NP0mn0cx6A6JiQtTIVjM0GKd/8cb849xc6In3rSxmlBTT6e5+v3CpylwFZj6KhivkAf+nER/pkfyowRFoTELojW9+F0VAapC641XdzBBwFWY/t2Ij0gA"},
    "WDL-WEB-1010":{"n":37,"d":"/vzxu/wQHnZQbpqfBrt1eGLV26rY167BRJllB/qqqq/gGf+TAIv6JafNqFTyz62Gq+xAUoTLQWD99elnqErxzmFtZLzPzDbglfczoYzeaEKxkoaT1l13MFEH/SZjL4ThcgbQkLzBv+cf/402z/S0am4sV28pZPPmA94h5MgKVI9hbGS9+/4AePW0Q/pcnKoQQiKxHrqanM/10SHduG6bWU+RBP+LYW/rxfkzgA"},
    "WDL-WEB-1011":{"n":37,"d":"/s1xu/wQWnZQbpzfBrt1emLV266Y167BdJllB/qqqq/gGf+TAIvYJafPCJTyz6WGq+xAM6TLQWD89eln7ErxzmFsZLzP3D4glfcz44zeauMhkoaX8l13MBAH/SZhPoThcgbSkLzCru8f/5U6T/S0Pk4sV2wg5PPmD94h5MgpdI9hbnW9+/4AWPW0Q/tUnKoQSmKxHrr8nM/10SHduG6bW0+RBO+LYW/rxfkzgA"},
    "WDL-WEB-1012":{"n":37,"d":"/iHty/wSIpXQbrLH5Lt1KaXF26qpEK7BdxddB/qqqq/gGqPiAL4XOdPnL3wRQYKKkw/PauUMXRXxhC57kKl/9oNdFzL3LDU85DCeipCvqWiJcQi0vGWUvyt2OjoUI/UmbnoxHoQgjoSRx2W9U4Vzi2MwJq2nTBBoKLYZB0dTNUh9GWjMPPoAWXuMY/gvEqrwVb7BGbrfgL+11hk+Nm61YawfBI5sfR/utD4vgA"},
    "WDL-WEB-1013":{"n":37,"d":"/ia2o/wUbrVQbrSH5Lt17Lm126bpEK7BJ5VVB/qqqq/gEoNgAIK1OdZ0SKBghoqKkw/PK0cEfZMr6Zig3In9/qNcFzL3OyGNIyyeyJCvq0sRUYqr9dNP00r0MhqWMvUmbmZC2ZhTn4yRx3+58wd7svXrSx4sxDDqJLYZB0cB0lQM23nMPPoAWfmEQ/n8fyowRd5DEbo5gL+10QVP8W6VY6wfBBxkXZ/t2Yj0gA"},
    "WDL-WEB-1014":{"n":37,"d":"/hrty/wSZpXQbrbH5Lt1K6XF26qpEK7BRRddB/qqqq/gGmPiAL5ZOdPkB+wRQYbokw/PCtUMXRXghC57kIl/9oN8nzL3JDm85DCOxJCvqsAJcQi42mWUvyp2OjoWM/Umbn4THoQgjoSRx22104VzDw8wJq+LzBBoKJIZB0cwBUh9G2nMPPoAe3uMY/i3EqrwVT7BGbqXgL+110k+Nm6zYawfBI5cfR/vtD4vgA"},
    "WDL-WEB-1015":{"n":37,"d":"/p22o/wQa7FQbr0xPrt0u+zl26WEpi7BUYUVB/qqqq/gA0dwAKNN4rkqJWU109WFJdSiS2dFeYM66ZignK3tv6bLRF9B5jhYdnnjMEvCHOPQVZrnk9NP0kvkcx6C+ZiQtTY1jM0GKVf8caewdxc6NpnrSxgABTT6f/+v3CoztwFZj6OhivkAf+nER/tkfyowRFpTELpHW9+F0QAapC6+1XdzBAwVWY/s2Yj0gA"},
    "WDL-WEB-1016":{"n":37,"d":"/rY2o/wQK7FQbr0RPrt0mezl26XEpi7BcYUVB/qqqq/gBwdwAKNF4rkpjLU109GHJdSiCldFeYEr6Zig2K3tv6bK1F9B57RYdnk/nkvCHOZAVZrn09NP0mjkcx6A+JiQtXI1jM0GOd/8caawdxc68nPrSxoJlTT6e5mv3CpRhwFZj6KhivkAXenER/r8fyowTJpTELojW9+F0AAapC6+13dzBBw1WY/t2Yj0gA"},
    "WDL-WEB-1017":{"n":37,"d":"/rFty/wU/fhQbo2KUrt1CaXF26dfy67BE8wxB/qqqq/gFU5UALc8jwpfrjwRQa/cSGJ4+T5h68fxhC57juTJLewYuemahbW85DDmsf0ZdA70x9P4mmWUvmDA4VeppC5L2LoTHoQiTWEnHBeYZV4ey+UwJqgkh33e2q90sZ1SNUh9ECV65/+Ab6DkV/svEqrwVpN3EroeNm/d1kk+Nm6luMGpBEURy8/utD4vgA"},
    "WDL-WEB-1018":{"n":37,"d":"/jc2o/wU4rVQbrCH5Lt17Lm126apEK7BNpVVB/qqqq/gEoNgAIL3OdZ0aHBghoaukw/PSGcEfZE66ZigmIv9/qFtHzL3Iy0NIywWRpCvq0PBUYqj9dNP00jUMhqWI/UmbmJi2ZhSjoSRx289cwd7vrHrSx+sVDDqJNYZB0di0lQM2XjMPPoAefmEQ/hkfyowQZ5DEbpZgL+10YVP8W6TYawfBCxEXZ/s2Ij0gA"},
    "WDL-WEB-1019":{"n":37,"d":"/ga2o/wUprVQbrbH5Lt17rm126LpEK7BBpVVB/qqqq/gEoNgAILVOdZ2yLBgho6ukw/PKUcEfZE76Zig3Iv9/qFsHzL3MyXNIywWBJCvqeJRUYqn0dNP0wnUMhqUMvUmbmJg2ZhRn4yRx3cx8wd76pHrSxyl1DDqKNYZB0dB8lQM22nMPPoAWfmEQ/lsfyowSd5DEbo/gL+10YVP8W6TY6wfBDxEXZ/s2Ij0gA"},
    "WDL-WEB-1020":{"n":37,"d":"/uXxu/wQFnZQbpi/Brt1emLV267Y167BdpllB/qqqq/gGb+TAIvyJafOLITyz6GAq+xAMbTLQWDt9elnqErxzmBs5LzP1Tbglfc7rYzeaGfxkoaX0l13MFMH/SZjL4ThcgLSkLzAv28f/4y+z/S08gQsV24ENPPmA5gh5MhLdI9hbHW9+/4AWPW0Q/rUjKoQTqLxHrranM/10THduG6ZWU+RBP+LYW/rxfkzgA"},
    "WDL-REG-WEB-1001":{"n":37,"d":"/rg+o/wTD3VQbqu3Hrt0Vczl26PUpi7BUQUVB/qqqq/gDjNwAKMq5LkpqnS109+Yp9Sika9FeYQ8iZig5PHtv6c8rEdB9IaYdnnziEXCGUfwhZrRildv0jDkQh6FZnmQtTg9jM0HLzf0ca8zt1c6J7PlSxkjhaT6fsOt3CprZwFZj+WhivgAZOnER/tUbyowTBoTELp3U9+F0oCKpC6hVXdzBHQVWY/q+Ij0gA"},
    "WDL-REG-WEB-1002":{"n":37,"d":"/sn5u/wTOvJQboxdJrt1tkLV26jI167BdBllB/qqqq/gGIuTAIvXI6fOi9Vyz6u/KexAyEzLQWXqlelnlDbxzmGKhKTP1wjglffjWYLebeJRQoati9lXMAknzCZksWXhckz4kLzCmJcX/5w5j7S0N0IiV26qpGPmBuIj5MgQlI9hbCK9+/8AYfW0Q/t8jKoQTiLxHrqOlM/10uFNuG6G20+RBIebYW/t5PkzgA"},
    "WDL-REG-WEB-1003":{"n":37,"d":"/sr5u/wTdrJQbox9Jrt1tELV26jI167BRBllB/qqqq/gGEuTAIu3I6fOrgVyz6O7KexAiUzLQWXrlelnkDTxzmOanKTPz4jglfc/m4Leb+PRQoahydlXMGgnzCZmsWXhckz4kLzCiZ8X/4SxT7S0LywiV28rdGPmAsIj5MgRhI9hbjO9+/8AY/W0Q/t8jKoQRmLxHrqMlM/10qFNuG6C20+RBJebYW/s5PkzgA"},
    "WDL-REG-WEB-1004":{"n":37,"d":"/sn5u/wTOvJQboo7Jrt1tELV26jI167BZRllB/qqqq/gEMuTAIu5I6fOolVyz6+/KexAqEzLQWf6leln0DbxzmGanKTP1gDglfdvnYLebWoRQoalz9lXMEsXzCZkoWXhckjakLzDqR8X/5S5T7S0JwQiV24CtGPmAoYj5MgxtI9hbDO9+/8AYfW0Q/p0jKoQSuLxHrqIlM/10nFNuG6E20+RBIebYW/s5PkzgA"},
    "WDL-REG-WEB-1005":{"n":37,"d":"/sr5u/wTdrJQboobJrt1tkLV26jI167BVRllB/qqqq/gEAuTAIvZI6fOh4Vyz6e7KexA6UzLQWf7leln1DTxzmOKhKTPzoDglfezX4Leb2uRQoapjdlXMCoXzCZmoWXhckjakLzDuBcX/4wxj7S0P2oiV2+DZGPmBqYj5MgwpI9hbiK9+/8AY/W0Q/p0jKoQQqLxHrqKlM/10jFNuG6A20+RBJebYW/t5PkzgA"},
    "WDL-REG-WEB-1006":{"n":37,"d":"/sr5u/wTMvJQbo5/Jrt1tkLV26zI167BdxllB/qqqq/gGIuTAIvVI6fOqlVyz6v/KexAiEzLQWfqleln1DTxzmK6lKTPzoCglfe//4LebMJBQoat79lXMCs3zCZmsWXhckzYkLzBiY8X/5y1j7S0M+oiV28GNGPmBuQj5MhztI9hbCK9+/8AYfW0Q/pkjKoQTqLxHrqClM/10iFNuG6E20+RBIebYW/t5PkzgA"},
    "WDL-REG-WEB-1007":{"n":37,"d":"/sn5u/wTfrJQbo5fJrt1tELV26zI167BRxllB/qqqq/gGEuTAIu1I6fOj4Vyz6P7KexAyUzLQWfrleln0DbxzmCqjKTP1gCglfdjPYLebsPBQoahrdlXMEo3zCZksWXhckzYkLzBmIcX/4Q9T7S0K4QiV26H5GPmAsQj5MhypI9hbjO9+/8AY/W0Q/pkjKoQRuLxHrqAlM/10mFNuG6A20+RBJebYW/s5PkzgA"},
    "WDL-REG-WEB-1008":{"n":37,"d":"/st5u/wTNvJQbogZJrt1lmLV26yI167BZxllB/qqqq/gHEuTAIvbI6fMCpVyz6PfKexAyEzLQWX6leln1DTxzmGalKTPzgTglfdvP4Leb0IRQoapidlXMGoHzCZkoGXhcgz4kLzBmY8X/5U1T7S0K4giV28j5GPmCsIj5MhzpI9hbiO9+/8AY/W0Q/vkjKoQSiLxHrqGlM/10nFNuG6C20+RBKebYW/s5PkzgA"},
    "WDL-REG-WEB-1009":{"n":37,"d":"/sh5u/wTerJQbog5Jrt1lGLV26yI167BVxllB/qqqq/gHIuTAIu7I6fML0Vyz6vbKexAiUzLQWX7leln0DbxzmOKjKTP1oTglfez/YLebUORQoaly9lXMAsHzCZmoGXhcgz4kLzBiIcX/429j7S0M+YiV26iNGPmDuIj5MhytI9hbDK9+/8AYfW0Q/vkjKoQQmLxHrqElM/10jFNuG6G20+RBLebYW/t5PkzgA"},
    "WDL-REG-WEB-1010":{"n":37,"d":"/vn5u/wTNvJQboxZJrt1tkLV26iI167BRhllB/qqqq/gEIuTAIu3I6fPowVyz6vdK+xA63zLQWXrleln1BbxzmCrlKTP1oiglfdz2YLebWoRQoahr9lXMGgXzCZmsGXhckz4kLzAmRcX/5QxD7S068wiV22qZGPmAuAj5MhypI9hbjK9+/8AQ/W0Q/t8jKoQSmLxHrrElM/10iFNuG6E20+RBLebYW/t5PkzgA"},
    "WDL-REG-WEB-1011":{"n":37,"d":"/vr5u/wTerJQbox5Jrt1tELV26iI167BdhllB/qqqq/gEEuTAIvXI6fPhtVyz6PZK+xAqnzLQWXqleln0BTxzmK7jKTPzgiglfevG4Leb2uRQoat7dlXMAkXzCZksGXhckz4kLzAiB8X/4y5z7S086IiV2wrtGPmBsAj5MhztI9hbCO9+/8AQfW0Q/t8jKoQQiLxHrrGlM/10mFNuG6A20+RBKebYW/s5PkzgA"},
    "WDL-REG-WEB-1012":{"n":37,"d":"/vr5u/wTPvJQbogdJrt1tELV26yI167BVBllB/qqqq/gGMuTAIvbI6fPqwVyz6+dK+xAy3zLQWX7leln0BTxzmOLnKTPzgjglfeju4LebMJBQoapj9lXMAg3zCZkoGXhckj6kLzCuYcX/5w9z7S0/yIiV2yu5GPmBoIj5MgwpI9hbiO9+/8AQ/W0Q/tsjKoQTiLxHrrOlM/10nFNuG6E20+RBLebYW/s5PkzgA"},
    "WDL-REG-WEB-1013":{"n":37,"d":"/vn5u/wTcrJQbog9Jrt1tkLV26yI167BZBllB/qqqq/gGAuTAIu7I6fPjtVyz6eZK+xAinzLQWX6leln1BbxzmGbhKTP1ojglfd/eYLebsPBQoalzdlXMGk3zCZmoGXhckj6kLzCqI8X/4S1D7S050wiV20vNGPmAqIj5MgxtI9hbDK9+/8AQfW0Q/tsjKoQRmLxHrrMlM/10jFNuG6A20+RBKebYW/t5PkzgA"},
    "WDL-REG-WEB-1014":{"n":37,"d":"/os+o/wTTzVQbq31Hrt0Vczl26OUpi7BQgUVB/qqqq/gDrNwAKNE5LkojvS109P+pdSik59FeYYsiZig5NPtv6QdvEdB7I7YdnkzDkXCG0ZwhZrZqFdv0nLkQh6Fd3mQtTwfjM0EDjf0cbczN1c68xXlSxsKhaT6eoWt3CopZwFZj/WhivgAROnER/pcbyowRNoTELo5U9+F0pCKpC6lVXdzBFQVWY/q+Ij0gA"},
    "WDL-REG-WEB-1015":{"n":37,"d":"/vn5u/wTcrJQbo5bJrt1tELV26yI167BdRllB/qqqq/gEEuTAIvVI6fPp1Vyz6OZK+xA6nzLQWfqlelnkBbxzmGLnKTP14DglffzvYLebkuBQoatidlXMCsHzCZmsGXhckzYkLzDmQcX/4w1z7S09woiV22HJGPmBsYj5MgQlI9hbCO9+/8AQfW0Q/pkjKoQQqLxHrrKlM/10qFNuG6C20+RBKebYW/s5PkzgA"},
    "WDL-REG-WEB-1016":{"n":37,"d":"/vn5u/wTNvJQboo/Jrt1tELV26iI167BVxllB/qqqq/gGMuTAIvZI6fPioVyz6/dK+xAi3zLQWf7lelnkBbxzmC7jKTP14Cglff/HYLebeJRQoap69lXMConzCZmoGXhckjakLzBqJ8X/5yxz7S0+4oiV20CdGPmBoQj5MhThI9hbiO9+/8AQ/W0Q/p0jKoQTqLxHrrClM/10rFNuG6G20+RBLebYW/s5PkzgA"},
    "WDL-REG-WEB-1017":{"n":37,"d":"/vr5u/wTerJQboofJrt1tkLV26iI167BZxllB/qqqq/gGAuTAIu5I6fPr1Vyz6fZK+xAynzLQWf6lelnlBTxzmKrlKTPzwCglfcj34Leb+PRQoalqdlXMEsnzCZkoGXhckjakLzBuZcX/4Q5D7S04+QiV2yDpGPmAqQj5MhSlI9hbDK9+/8AQfW0Q/p0jKoQRuLxHrrAlM/10vFNuG6C20+RBKebYW/t5PkzgA"},
    "WDL-REG-WEB-1018":{"n":37,"d":"/vh5u/wTMvJQboxZJrt1lGLV26jI167BRxllB/qqqq/gHAuTAIvXI6fNKkVyz6f9K+xAy3zLQWXrlelnkBbxzmObjKTP1wTglfcv3YLebmIBQoatjdlXMGsXzCZksWXhcgj6kLzBuJ8X/5UxD7S04+giV20npGPmCqIj5MhTlI9hbCK9+/8AQfW0Q/v0jKoQSiLxHrrGlM/10uFNuG6A20+RBJebYW/t5PkzgA"},
    "WDL-REG-WEB-1019":{"n":37,"d":"/vt5u/wTfrJQbox5Jrt1lmLV26jI167BdxllB/qqqq/gHMuTAIu3I6fND5Vyz6/5K+xAinzLQWXqlelnlBTxzmGLlKTPz4TglffzH4LebGOBQoahz9lXMAoXzCZmsWXhcgj6kLzBqZcX/425z7S0+4YiV2ymdGPmDoIj5MhShI9hbjO9+/8AQ/W0Q/v0jKoQQmLxHrrElM/10qFNuG6E20+RBIebYW/s5PkzgA"},
    "WDL-REG-WEB-1020":{"n":37,"d":"/tH5u/wTPvJQbop5Jrt1tELV26zI167BdBllB/qqqq/gHAuTAIuXI6fOLkVyz6+dKexAq3zrQWXrlelnkDbxzmGqBKTPzozglfd/tYLebudRQoalz9lXMCkHzCZmsGXhckj6kLzAqZ8X/4W9j7S084YiV28OdGPmDuIj5MhQhI9hbjK9+/8AYfW0Q/tkjKoQRqLxHrqKlM/106FNuG6A20+RBLebYW/t5PkzgA"},
  };

  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  /* Unpack one entry into { size, rows } where rows are "0"/"1" strings. */
  function unpack(entry) {
    var bits = [];
    var d = entry.d, i, j, v;
    for (i = 0; i < d.length; i++) {
      v = B64.indexOf(d.charAt(i));
      if (v < 0) continue;
      for (j = 5; j >= 0; j--) bits.push((v >> j) & 1);
    }
    var n = entry.n, rows = [];
    for (var r = 0; r < n; r++) {
      var row = "";
      for (var c = 0; c < n; c++) row += bits[r * n + c] ? "1" : "0";
      rows.push(row);
    }
    return { size: n, rows: rows };
  }

  function webdevCertQrMatrix(certId) {
    var entry = QR[certId];
    if (!entry) return null;
    return unpack(entry);
  }

  /* Inline SVG for a certificate ID. px = rendered size in CSS pixels.
     Includes a 2-module white quiet zone so it scans at small sizes. */
  function webdevCertQrSvg(certId, px) {
    var m = webdevCertQrMatrix(certId);
    if (!m) return "";
    var n = m.size, q = 2, total = n + q * 2, size = px || 120;
    var out = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size +
      '" height="' + size + '" viewBox="0 0 ' + total + ' ' + total +
      '" shape-rendering="crispEdges" role="img" aria-label="QR code — scan to verify this certificate">' +
      '<rect x="0" y="0" width="' + total + '" height="' + total + '" fill="#ffffff"/>';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (m.rows[r].charAt(c) === "1") {
          out += '<rect x="' + (c + q) + '" y="' + (r + q) +
            '" width="1" height="1" fill="#000000"/>';
        }
      }
    }
    return out + "</svg>";
  }

  root.WEBDEV_CERT_QR = QR;
  root.webdevCertQrMatrix = webdevCertQrMatrix;
  root.webdevCertQrSvg = webdevCertQrSvg;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      WEBDEV_CERT_QR: QR,
      webdevCertQrMatrix: webdevCertQrMatrix,
      webdevCertQrSvg: webdevCertQrSvg
    };
  }
})(typeof window !== "undefined" ? window : this);
