# is-cron-now
Checks if cron string is active right now or active with custom date

## cron support
This is a javascript cron parser so day of the week is 0 - 6 (1 is monday) and month of the year is 0 -11

this package supports the following cron formats.


```
* * * * * *
| | | | | |
| | | | | +-- Year              (range: 1900-3000)
| | | | +---- Day of the Week   (range: 0-6, 1 standing for Monday)
| | | +------ Month of the Year (range: 0-11)
| | +-------- Day of the Month  (range: 1-31)
| +---------- Hour              (range: 0-23)
+------------ Minute            (range: 0-59)
```

**basic**
```
* * * * * *
```

**With list**
```
* * * * * 2015,2017,2019
```

**With range**
```
* * * * * 2015-2019
```

**With every**
```
* * * * * 2016/2
```

**With range and list**
```
* 0-6,16-23 * * * *
```

## Example

```javascript
const {isActive} = require('is-cron-now')

isActive('* 1 */4 11 * 2016-2019', new Date(2018, 11, 16, 1, 0)) // -> true

isActive('24 3 17 11 * 1995', new Date(1995, 11, 17, 3, 24)) // -> true
```

## API

## isActive

Takes a cron string and optionally a custom date.

### Syntax

```javascript
  isActive('* * * * * *')

  isActive('* * * * * 2019', new Date(2019))
```

### Parameters

* string
  * cron formated string
* Date?: optionall
  * javascript date

### Return value
boolean: cron is active or not
