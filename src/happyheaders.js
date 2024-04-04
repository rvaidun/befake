// credit to retoheusser on Github
const data = [
    {
        validFrom: "2024-04-01T00:00:00.000Z",
        signature: "MToxNzExOTI5NjAwOppxUXNXvkshwQfzOYCpUAnPBG0HSi0/AUUQ/S+Bkcb9",
    },
    {
        validFrom: "2024-04-08T00:00:00.000Z",
        signature: "MToxNzEyNTM0NDAwOrs9DjPSQtEhkOF3u5WTsoVUDtBE3kxOi/b2B3WTGuqq",
    },
    {
        validFrom: "2024-04-15T00:00:00.000Z",
        signature: "MToxNzEzMTM5MjAwOhza29nmUbSICRFPxzskmlXJJEVBYTLWgaxi05850ZZu",
    },
    {
        validFrom: "2024-04-22T00:00:00.000Z",
        signature: "MToxNzEzNzQ0MDAwOrXDY177u5+5fYerIpKsweI1Q/M0jCLT8FEn2tGh6gna",
    },
    {
        validFrom: "2024-04-29T00:00:00.000Z",
        signature: "MToxNzE0MzQ4ODAwOiTnWMxm27SnN+bxiotBHP4cVndEhwea47fAxJ+dpmWJ",
    },
    {
        validFrom: "2024-05-06T00:00:00.000Z",
        signature: "MToxNzE0OTUzNjAwOtX6M7ZIG97foLVG3CcqtyaLbGCV8XH2TVv+UjRTSP52",
    },
    {
        validFrom: "2024-05-13T00:00:00.000Z",
        signature: "MToxNzE1NTU4NDAwOkTQP9GX7HfSD52PVAzDRhiC7dRHayK/v75xvHl9JGmo",
    },
    {
        validFrom: "2024-05-20T00:00:00.000Z",
        signature: "MToxNzE2MTYzMjAwOnFkfYR+zEFmTa6tY0YSHy68YowvFnKLdgudoM/SrAl/",
    },
    {
        validFrom: "2024-05-27T00:00:00.000Z",
        signature: "MToxNzE2NzY4MDAwOhIUgfFaalerkNhvpyu8DzoDV9ql9xYsRfXlY6WZjOO7",
    },
    {
        validFrom: "2024-06-03T00:00:00.000Z",
        signature: "MToxNzE3MzcyODAwOm1Qr5aJK5EIwkwEH8ecd4bC5NvcEvdJrVkymC32Zmf2",
    },
    {
        validFrom: "2024-06-10T00:00:00.000Z",
        signature: "MToxNzE3OTc3NjAwOhrMztJRLVb52iuvzLADK1TJ5EsVSTBs5wDeNei8X8uP",
    },
    {
        validFrom: "2024-06-17T00:00:00.000Z",
        signature: "MToxNzE4NTgyNDAwOgW1JF3hT0YnUsXTdMDVMpmeM27ZPDrFQW4tlSNpkVQ8",
    },
    {
        validFrom: "2024-06-24T00:00:00.000Z",
        signature: "MToxNzE5MTg3MjAwOsF/wzgC0RwjqEzQYroSwJFZ3GaL0JmsZSFHyrMFVPjI",
    },
    {
        validFrom: "2024-07-01T00:00:00.000Z",
        signature: "MToxNzE5NzkyMDAwOrXpGXi4xBMEgo6C/Md50nxf2LcobZuuoIwYpOw911Uw",
    },
    {
        validFrom: "2024-07-08T00:00:00.000Z",
        signature: "MToxNzIwMzk2ODAwOvdnIlMgYzUUHAOFpFL4z8BUsn8fEBR+qcY3ExKJJRCK",
    },
    {
        validFrom: "2024-07-15T00:00:00.000Z",
        signature: "MToxNzIxMDAxNjAwOrsIdmmRsfRAyWChx/CHH1ezZL2X67hg928yiCcSWBIX",
    },
    {
        validFrom: "2024-07-22T00:00:00.000Z",
        signature: "MToxNzIxNjA2NDAwOg7ywK0rtLbmQoifKJEJk6w1n5M8nSBSyfuhXdfNztRh",
    },
    {
        validFrom: "2024-07-29T00:00:00.000Z",
        signature: "MToxNzIyMjExMjAwOqt57LmUsHNa3M4nGsooljwR16V8gA+9hJBKRHtAgNxw",
    },
    {
        validFrom: "2024-08-05T00:00:00.000Z",
        signature: "MToxNzIyODE2MDAwOm2b+2pwMg8HM78JFfSPphVHUsXv+WGkIaVl8bssdE/Z",
    },
    {
        validFrom: "2024-08-12T00:00:00.000Z",
        signature: "MToxNzIzNDIwODAwOhFN6cIriDV7EvSUjcI9c2NH1WYVAiD+4iDeBw548mAd",
    },
    {
        validFrom: "2024-08-19T00:00:00.000Z",
        signature: "MToxNzI0MDI1NjAwOgeSZBSAjGJfFFflCrpVfItCVhSro/2es+9EIFQGhb/r",
    },
    {
        validFrom: "2024-08-26T00:00:00.000Z",
        signature: "MToxNzI0NjMwNDAwOtc4ixhSzlagkGpR4T6FAR6yykCkFERhiiHSjCwIeYM7",
    },
    {
        validFrom: "2024-09-02T00:00:00.000Z",
        signature: "MToxNzI1MjM1MjAwOonGWIWf+hGToGvq0Snom3LIrW7SyUmvHwkrVhwhUsXH",
    },
    {
        validFrom: "2024-09-09T00:00:00.000Z",
        signature: "MToxNzI1ODQwMDAwOi9tT8jf4daO7Q+1boeDaulBv95DrPpmnRa5swH9OxRr",
    },
    {
        validFrom: "2024-09-16T00:00:00.000Z",
        signature: "MToxNzI2NDQ0ODAwOu2LOKOABxltvnXwG9Q+p0XvvxC2Ml3tQ7y7aGeCFmLc",
    },
    {
        validFrom: "2024-09-23T00:00:00.000Z",
        signature: "MToxNzI3MDQ5NjAwOrJg1lg/U8gfnFLTQybRkC3XodotNgRUdTYHCvEQ8Xzk",
    },
    {
        validFrom: "2024-09-30T00:00:00.000Z",
        signature: "MToxNzI3NjU0NDAwOqVEoYMiLcQ3l3osR29Sne7ctA5CfcdJ6UaIKYUSA0mh",
    },
    {
        validFrom: "2024-10-07T00:00:00.000Z",
        signature: "MToxNzI4MjU5MjAwOk2Hk24UDc1/RutPfSUr1I4tqjeT0GFKOIFLowOUj9bD",
    },
    {
        validFrom: "2024-10-14T00:00:00.000Z",
        signature: "MToxNzI4ODY0MDAwOpkdyR9wYFvXTVb+ULtX8S4nffTpjUtMx95bn3pniw/g",
    },
    {
        validFrom: "2024-10-21T00:00:00.000Z",
        signature: "MToxNzI5NDY4ODAwOswj2XfNY0LOwPfdq1HZwLkr1uV9vkAz6qw7LWxjBmq1",
    },
    {
        validFrom: "2024-10-28T00:00:00.000Z",
        signature: "MToxNzMwMDczNjAwOnPg6MEBHhrfsaTQEVwFE6eIzHReQ3iGH22FcaifTtrm",
    },
    {
        validFrom: "2024-11-04T00:00:00.000Z",
        signature: "MToxNzMwNjc4NDAwOp9GyAUzLft9urSZmfqnNwQnj18L4h//3Biz9MNk7cKs",
    },
    {
        validFrom: "2024-11-11T00:00:00.000Z",
        signature: "MToxNzMxMjgzMjAwOudS91DrNP02gPshW/vCCL+cbCVW3SoM0Kb3x3O/86Yk",
    },
    {
        validFrom: "2024-11-18T00:00:00.000Z",
        signature: "MToxNzMxODg4MDAwOtLWMpoG48KsiHIISPK5Vphfe0ce1R6KrdLNlVpwq7Rw",
    },
    {
        validFrom: "2024-11-25T00:00:00.000Z",
        signature: "MToxNzMyNDkyODAwOvBhRTrMYUn0WxDC3eI3mWuE/iXy7EmPJ6lWqAUN8Tng",
    },
    {
        validFrom: "2024-12-02T00:00:00.000Z",
        signature: "MToxNzMzMDk3NjAwOjUK8Y3K5+GcEkXbWYDRFj1utzrpKmxP+47FVJ7VoLPA",
    },
    {
        validFrom: "2024-12-09T00:00:00.000Z",
        signature: "MToxNzMzNzAyNDAwOmINpHJolrtHCZ3+/wYbrQ4yW7HKPj3KyYisQe0FYHGc",
    },
    {
        validFrom: "2024-12-16T00:00:00.000Z",
        signature: "MToxNzM0MzA3MjAwOjnrC/kiNAGNS4tsn8wVCDrRQExDeK24aNadaf3rM7WA",
    },
    {
        validFrom: "2024-12-23T00:00:00.000Z",
        signature: "MToxNzM0OTEyMDAwOk6Qf8wz71OYD+VlDOJwhGaOrs4Qz8axu7Dgavbpp+V/",
    },
    {
        validFrom: "2024-12-30T00:00:00.000Z",
        signature: "MToxNzM1NTE2ODAwOva5rG4LY27UZP841QvQhX8RvOK0jXiOU0QQqdYvg1Z3",
    },
    {
        validFrom: "2025-01-06T00:00:00.000Z",
        signature: "MToxNzM2MTIxNjAwOlvx5Q/Qh15MhPdGC/4tSaSa159fjyIkNiCh8w3rrpSA",
    },
    {
        validFrom: "2025-01-13T00:00:00.000Z",
        signature: "MToxNzM2NzI2NDAwOtsJPD2+uRmge6QsbSEN6QGBQA/tDnqQt5CLbWclkuNE",
    },
    {
        validFrom: "2025-01-20T00:00:00.000Z",
        signature: "MToxNzM3MzMxMjAwOmgff/0DHukb4eM9T/z3K1hVU+xiCKTzDiaT01UOSxvd",
    },
    {
        validFrom: "2025-01-27T00:00:00.000Z",
        signature: "MToxNzM3OTM2MDAwOgyYAr5EeAUsHYNoPv/jkjN62AIWMyVIxGTEkLLuJG5M",
    },
    {
        validFrom: "2025-02-03T00:00:00.000Z",
        signature: "MToxNzM4NTQwODAwOqcOpguBjg48LmUtdmqwqWkdOrRSte9sTSIiSpoXUhpU",
    },
    {
        validFrom: "2025-02-10T00:00:00.000Z",
        signature: "MToxNzM5MTQ1NjAwOqg1HhaNQTUwdtba1CuCFMzVqhTa97H3iCwtJqLZZihh",
    },
    {
        validFrom: "2025-02-17T00:00:00.000Z",
        signature: "MToxNzM5NzUwNDAwOnGbe3x/259+8WpIAfee63RTulI1iJp5Au5q3v9l5yKf",
    },
    {
        validFrom: "2025-02-24T00:00:00.000Z",
        signature: "MToxNzQwMzU1MjAwOuFX1bu1CzJwi8UCMfe9VKIT9+xikDZnz4EhM0SooJO/",
    },
    {
        validFrom: "2025-03-03T00:00:00.000Z",
        signature: "MToxNzQwOTYwMDAwOno5QzkV5pdK578MuhrGwIHitTV7C3CNevUxgdUCOdP8",
    },
    {
        validFrom: "2025-03-10T00:00:00.000Z",
        signature: "MToxNzQxNTY0ODAwOinLQ7aDvupIFXo1SVj9fu4Rv33+fE7chjFcAvRmT0L+",
    },
    {
        validFrom: "2025-03-17T00:00:00.000Z",
        signature: "MToxNzQyMTY5NjAwOhStBfU5Wq1TRcIclo4ggDso8+BOrg+ylpUDazOuRD6m",
    },
    {
        validFrom: "2025-03-24T00:00:00.000Z",
        signature: "MToxNzQyNzc0NDAwOnWp9usRa6YJKTmvODDlG8YmNAjtLn3Q5lR7tkASAgcL",
    },
    {
        validFrom: "2025-03-31T00:00:00.000Z",
        signature: "MToxNzQzMzc5MjAwOq3/LTVSzf8xz42VKbOU/ELqmndqUy+6Nh9fxdvSeXzV",
    },
    {
        validFrom: "2025-04-07T00:00:00.000Z",
        signature: "MToxNzQzOTg0MDAwOp9BhNSYp9DsgCtQSMLKXF+pES7FJAtpXVqNKuhSg/2S",
    },
    {
        validFrom: "2025-04-14T00:00:00.000Z",
        signature: "MToxNzQ0NTg4ODAwOgO5RVw04EZppTXXBp1fUeSR2IF071nSgoME0kY5qJYT",
    },
    {
        validFrom: "2025-04-21T00:00:00.000Z",
        signature: "MToxNzQ1MTkzNjAwOheaLuuQ0xcA6PV7vnLz5j4airVs3M3UyqoXECx6GFMd",
    },
    {
        validFrom: "2025-04-28T00:00:00.000Z",
        signature: "MToxNzQ1Nzk4NDAwOqgomq1zFXUta3NvLcMfCoYDMzkAWDt3ZH3emOlHtr1b",
    },
    {
        validFrom: "2025-05-05T00:00:00.000Z",
        signature: "MToxNzQ2NDAzMjAwOiCENQLlUNj7Eq69NYYQ8XREHX1QimAxmoaVAmFEGm+9",
    },
    {
        validFrom: "2025-05-12T00:00:00.000Z",
        signature: "MToxNzQ3MDA4MDAwOsrqP4HijYGookPwJpnweP2O/0aAiWESjdbwYZobZKU9",
    },
    {
        validFrom: "2025-05-19T00:00:00.000Z",
        signature: "MToxNzQ3NjEyODAwOssaX7gZDx3C5rIUu4FrWUGmkLpsCgaeFBEKt8edEtEO",
    },
    {
        validFrom: "2025-05-26T00:00:00.000Z",
        signature: "MToxNzQ4MjE3NjAwOiN2dVCWuxoJbqdSRknyyxIPsmKa2F7jmbimkkACriGh",
    },
    {
        validFrom: "2025-06-02T00:00:00.000Z",
        signature: "MToxNzQ4ODIyNDAwOrhGQ8cqFVsU/5Bf8Iz/TxNYY0acOF/zGKgCspP6M1A3",
    },
    {
        validFrom: "2025-06-09T00:00:00.000Z",
        signature: "MToxNzQ5NDI3MjAwOuz+gvekYnA/uImh291JbqnHhZT+6V2lt40oG1vlYqy0",
    },
    {
        validFrom: "2025-06-16T00:00:00.000Z",
        signature: "MToxNzUwMDMyMDAwOr+gWLEBOtKG/pF1MygZPRJ1uFLUe/Q+OaIL6uPGYprx",
    },
    {
        validFrom: "2025-06-23T00:00:00.000Z",
        signature: "MToxNzUwNjM2ODAwOlbGoAspipZWtEjtCFwqHvJhcyFO47BOa9SOJ5O5veVh",
    },
    {
        validFrom: "2025-06-30T00:00:00.000Z",
        signature: "MToxNzUxMjQxNjAwOulNM+jPBuaFH7fFZ8HADAuTJN5KaQcZQI8PMmpG269F",
    },
    {
        validFrom: "2025-07-07T00:00:00.000Z",
        signature: "MToxNzUxODQ2NDAwOjHUVRHFlbtC+P1vaBxL3qVsYmsFuXBt/2+8Kl4o4pbm",
    },
    {
        validFrom: "2025-07-14T00:00:00.000Z",
        signature: "MToxNzUyNDUxMjAwOpPI4HkfwqflAifB6whe5i27FCU+6MBhg0URBPWMFPJj",
    },
    {
        validFrom: "2025-07-21T00:00:00.000Z",
        signature: "MToxNzUzMDU2MDAwOrmO8dp/reZBWwTyv/8Te3YZyPWDHdVkHu8YjQcLJFt0",
    },
    {
        validFrom: "2025-07-28T00:00:00.000Z",
        signature: "MToxNzUzNjYwODAwOipI9biFr25dL/oqHdT53xPJaS2E35exX64GiXPFlGnw",
    },
    {
        validFrom: "2025-08-04T00:00:00.000Z",
        signature: "MToxNzU0MjY1NjAwOmRyyyHgmolGF5Ak2tvRPjZ+8BtDibo/wsNAD7+Akewg",
    },
    {
        validFrom: "2025-08-11T00:00:00.000Z",
        signature: "MToxNzU0ODcwNDAwOiGjdQb4OelVbm6JTPLKbx9rl1tmQT3zHTxVq7Tdo685",
    },
    {
        validFrom: "2025-08-18T00:00:00.000Z",
        signature: "MToxNzU1NDc1MjAwOrsW6E+yeodQCOoG8P+Arh4c+5JgHV4OvUhXkPuAC7o3",
    },
    {
        validFrom: "2025-08-25T00:00:00.000Z",
        signature: "MToxNzU2MDgwMDAwOkNeLEok2leJFI5skVL0u10wFlk4FKmd0AkGlhHfTR4o",
    },
    {
        validFrom: "2025-09-01T00:00:00.000Z",
        signature: "MToxNzU2Njg0ODAwOnis9FxoqD2N9o2kAmw9J9HKDND+ucVfMyd22/6E1/9q",
    },
    {
        validFrom: "2025-09-08T00:00:00.000Z",
        signature: "MToxNzU3Mjg5NjAwOgVAYI3+3hsjHnNlwsAnqg4HuGmaot60aYMrjgoUXOL0",
    },
    {
        validFrom: "2025-09-15T00:00:00.000Z",
        signature: "MToxNzU3ODk0NDAwOv8n7O2gX7V7HsG/fKHq1YnWEk/1H6VKutlcYz2IZYPB",
    },
    {
        validFrom: "2025-09-22T00:00:00.000Z",
        signature: "MToxNzU4NDk5MjAwOq1DjwLvGEL2EFKRRcqfpDKLB6GrRUkQtzINpH++fo1d",
    },
    {
        validFrom: "2025-09-29T00:00:00.000Z",
        signature: "MToxNzU5MTA0MDAwOlQzCOOlu+qz7fmzT04IYOKY1cMKtM8jh0thlYe6/XAP",
    },
    {
        validFrom: "2025-10-06T00:00:00.000Z",
        signature: "MToxNzU5NzA4ODAwOhYSyE/Nj5MC4B995xBWVJQpOuf8gQ6vjGLWwhOMDdLs",
    },
    {
        validFrom: "2025-10-13T00:00:00.000Z",
        signature: "MToxNzYwMzEzNjAwOnnFzq6DUhsiSUFrwTxOVChpscb0tQwQXu6cq150AaUf",
    },
    {
        validFrom: "2025-10-20T00:00:00.000Z",
        signature: "MToxNzYwOTE4NDAwOijQgAFEIt5EZiL7rUu4c0i2VUt3C0/0VWlKTk2DS/RG",
    },
    {
        validFrom: "2025-10-27T00:00:00.000Z",
        signature: "MToxNzYxNTIzMjAwOuNrW/8pszYQDPC+Ja42J2G2fqPl+gPPbX6zUmOCdvNH",
    },
    {
        validFrom: "2025-11-03T00:00:00.000Z",
        signature: "MToxNzYyMTI4MDAwOs6lH4ZQiq9IsFQSA1+q1Al4uN8oV8Odz3FxVAoRoX92",
    },
    {
        validFrom: "2025-11-10T00:00:00.000Z",
        signature: "MToxNzYyNzMyODAwOjIs8NS7nQ6kSxpaLUHk344k5a/JgcCr13OjI8ZBYrGt",
    },
    {
        validFrom: "2025-11-17T00:00:00.000Z",
        signature: "MToxNzYzMzM3NjAwOjdYii3AmBdqLwjktRNAyP0EGyu3QVhd1r5eJ1t6EEyh",
    },
    {
        validFrom: "2025-11-24T00:00:00.000Z",
        signature: "MToxNzYzOTQyNDAwOum7ywHhh4Ujl4qkt0WKQu+qAd02kDVxsIjsSdUlj+/5",
    },
    {
        validFrom: "2025-12-01T00:00:00.000Z",
        signature: "MToxNzY0NTQ3MjAwOvmgrq+dKI5Nlz09axnUUkfFfs5jnAUr2TmzCkmTu5nu",
    },
    {
        validFrom: "2025-12-08T00:00:00.000Z",
        signature: "MToxNzY1MTUyMDAwOgRIYsrA2XdnWsoJsq77eOVVtdNIQMMan/lZRYdBC/XV",
    },
    {
        validFrom: "2025-12-15T00:00:00.000Z",
        signature: "MToxNzY1NzU2ODAwOm1PjlvI1A6rZWlXBlyWvb27dKnOBphGsY7qECqqx/Sv",
    },
    {
        validFrom: "2025-12-22T00:00:00.000Z",
        signature: "MToxNzY2MzYxNjAwOvUI+YaeLQjiqbTyhgH0ewBbkdOEM8FlcUz5+zixo1Sk",
    },
    {
        validFrom: "2025-12-29T00:00:00.000Z",
        signature: "MToxNzY2OTY2NDAwOoZdjFNRxCKSQ7oquZrYTmwff9GVPEG7IH6w9hikHZNi",
    },
    {
        validFrom: "2026-01-05T00:00:00.000Z",
        signature: "MToxNzY3NTcxMjAwOlgvy47qD3s9tQFwPjMDtv13DVGJUZKv/osRLWoqXeEK",
    },
    {
        validFrom: "2026-01-12T00:00:00.000Z",
        signature: "MToxNzY4MTc2MDAwOqVBkYCx8BEck3n56MbLfgo4HPhGzznrX/BYZm5CHTxQ",
    },
    {
        validFrom: "2026-01-19T00:00:00.000Z",
        signature: "MToxNzY4NzgwODAwOm91RZb2pwMFtelxJVOAwpyiZX2Vw608kiIG90bVwLy1",
    },
    {
        validFrom: "2026-01-26T00:00:00.000Z",
        signature: "MToxNzY5Mzg1NjAwOnaMCWGno4IKtkqLsM/Z+12duBS8TlQVUayC8a30cXX/",
    },
    {
        validFrom: "2026-02-02T00:00:00.000Z",
        signature: "MToxNzY5OTkwNDAwOttcQTngkKaIbJxekIndK+8QRfF53RkBJEQBM///J9Zv",
    },
    {
        validFrom: "2026-02-09T00:00:00.000Z",
        signature: "MToxNzcwNTk1MjAwOht/XdDXdtXuYjnMWbeLahYqnf4z8VHMFwW6+ZZ67wwG",
    },
    {
        validFrom: "2026-02-16T00:00:00.000Z",
        signature: "MToxNzcxMjAwMDAwOjr2+mdJ4gpckXYsJy7Ewg7eeEb2xDzC56q0qhY+P0N7",
    },
    {
        validFrom: "2026-02-23T00:00:00.000Z",
        signature: "MToxNzcxODA0ODAwOvBgAOzlfsiaRB7II+Vtkx1f3dwOrK3WuLA2YLTgFeYh",
    },
    {
        validFrom: "2026-03-02T00:00:00.000Z",
        signature: "MToxNzcyNDA5NjAwOvWTrWh8U4vrIeoaJjOUy/D1IGSEvwTBhG/LehE/HH3c",
    },
    {
        validFrom: "2026-03-09T00:00:00.000Z",
        signature: "MToxNzczMDE0NDAwOl4qJCizx53iqD30TatcsFNXeBs6AQoFt5o+UX74tX91",
    },
    {
        validFrom: "2026-03-16T00:00:00.000Z",
        signature: "MToxNzczNjE5MjAwOqaNQxzUqo65HFNBLLqE4Fa0+InR4pbg9SuGkv4AAhfg",
    },
    {
        validFrom: "2026-03-23T00:00:00.000Z",
        signature: "MToxNzc0MjI0MDAwOp406o5g+DnTZLA7TWs9w4XKJNcLfgAbVeG3RSAQmvae",
    },
];
export function getHeaders() {
    console.log("Using happy headers!");
    const now = new Date().toISOString();
    const { signature } = data.findLast(({ validFrom }) => validFrom <= now);
    return {
        "bereal-timezone": "Europe/Paris",
        "bereal-device-id": "820B5AA5-0FDE-4199-93C8-64B12D08D5EE",
        "bereal-signature": signature,
    };
}
