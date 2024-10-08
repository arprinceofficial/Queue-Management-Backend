const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const e = require('cors');
const prisma = new PrismaClient();

async function main() {
    // create countries
    await prisma.country.createMany({
        data: [
            { "country_name": "Afghanistan", "country_code": "93", "iso": "AF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Albania", "country_code": "355", "iso": "AL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Algeria", "country_code": "213", "iso": "DZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "American Samoa", "country_code": "1-684", "iso": "AS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Andorra", "country_code": "376", "iso": "AD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Angola", "country_code": "244", "iso": "AO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Anguilla", "country_code": "1-264", "iso": "AI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Antarctica", "country_code": "672", "iso": "AQ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Antigua and Barbuda", "country_code": "1-268", "iso": "AG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Argentina", "country_code": "54", "iso": "AR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Armenia", "country_code": "374", "iso": "AM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Aruba", "country_code": "297", "iso": "AW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Australia", "country_code": "61", "iso": "AU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Austria", "country_code": "43", "iso": "AT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Azerbaijan", "country_code": "994", "iso": "AZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bahamas", "country_code": "1-242", "iso": "BS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bahrain", "country_code": "973", "iso": "BH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bangladesh", "country_code": "880", "iso": "BD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Barbados", "country_code": "1-246", "iso": "BB", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Belarus", "country_code": "375", "iso": "BY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Belgium", "country_code": "32", "iso": "BE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Belize", "country_code": "501", "iso": "BZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Benin", "country_code": "229", "iso": "BJ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bermuda", "country_code": "1-441", "iso": "BM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bhutan", "country_code": "975", "iso": "BT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bolivia", "country_code": "591", "iso": "BO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bosnia and Herzegovina", "country_code": "387", "iso": "BA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Botswana", "country_code": "267", "iso": "BW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Brazil", "country_code": "55", "iso": "BR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "British Indian Ocean Territory", "country_code": "246", "iso": "IO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "British Virgin Islands", "country_code": "1-284", "iso": "VG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Brunei", "country_code": "673", "iso": "BN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Bulgaria", "country_code": "359", "iso": "BG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Burkina Faso", "country_code": "226", "iso": "BF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Burundi", "country_code": "257", "iso": "BI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cambodia", "country_code": "855", "iso": "KH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cameroon", "country_code": "237", "iso": "CM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Canada", "country_code": "1", "iso": "CA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cape Verde", "country_code": "238", "iso": "CV", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cayman Islands", "country_code": "1-345", "iso": "KY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Central African Republic", "country_code": "236", "iso": "CF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Chad", "country_code": "235", "iso": "TD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Chile", "country_code": "56", "iso": "CL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "China", "country_code": "86", "iso": "CN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Christmas Island", "country_code": "61", "iso": "CX", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cocos Islands", "country_code": "61", "iso": "CC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Colombia", "country_code": "57", "iso": "CO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Comoros", "country_code": "269", "iso": "KM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cook Islands", "country_code": "682", "iso": "CK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Costa Rica", "country_code": "506", "iso": "CR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Croatia", "country_code": "385", "iso": "HR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cuba", "country_code": "53", "iso": "CU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Curacao", "country_code": "599", "iso": "CW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Cyprus", "country_code": "357", "iso": "CY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Czech Republic", "country_code": "420", "iso": "CZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Democratic Republic of the Congo", "country_code": "243", "iso": "CD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Denmark", "country_code": "45", "iso": "DK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Djibouti", "country_code": "253", "iso": "DJ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Dominica", "country_code": "1-767", "iso": "DM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Dominican Republic", "country_code": "1-809, 1-829, 1-849", "iso": "DO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "East Timor", "country_code": "670", "iso": "TL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ecuador", "country_code": "593", "iso": "EC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Egypt", "country_code": "20", "iso": "EG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "El Salvador", "country_code": "503", "iso": "SV", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Equatorial Guinea", "country_code": "240", "iso": "GQ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Eritrea", "country_code": "291", "iso": "ER", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Estonia", "country_code": "372", "iso": "EE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ethiopia", "country_code": "251", "iso": "ET", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Falkland Islands", "country_code": "500", "iso": "FK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Faroe Islands", "country_code": "298", "iso": "FO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Fiji", "country_code": "679", "iso": "FJ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Finland", "country_code": "358", "iso": "FI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "France", "country_code": "33", "iso": "FR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "French Polynesia", "country_code": "689", "iso": "PF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Gabon", "country_code": "241", "iso": "GA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Gambia", "country_code": "220", "iso": "GM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Georgia", "country_code": "995", "iso": "GE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Germany", "country_code": "49", "iso": "DE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ghana", "country_code": "233", "iso": "GH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Gibraltar", "country_code": "350", "iso": "GI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Greece", "country_code": "30", "iso": "GR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Greenland", "country_code": "299", "iso": "GL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Grenada", "country_code": "1-473", "iso": "GD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guam", "country_code": "1-671", "iso": "GU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guatemala", "country_code": "502", "iso": "GT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guernsey", "country_code": "44-1481", "iso": "GG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guinea", "country_code": "224", "iso": "GN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guinea-Bissau", "country_code": "245", "iso": "GW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Guyana", "country_code": "592", "iso": "GY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Haiti", "country_code": "509", "iso": "HT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Honduras", "country_code": "504", "iso": "HN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Hong Kong", "country_code": "852", "iso": "HK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Hungary", "country_code": "36", "iso": "HU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Iceland", "country_code": "354", "iso": "IS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "India", "country_code": "91", "iso": "IN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Indonesia", "country_code": "62", "iso": "ID", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Iran", "country_code": "98", "iso": "IR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Iraq", "country_code": "964", "iso": "IQ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ireland", "country_code": "353", "iso": "IE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Isle of Man", "country_code": "44-1624", "iso": "IM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Israel", "country_code": "972", "iso": "IL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Italy", "country_code": "39", "iso": "IT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ivory Coast", "country_code": "225", "iso": "CI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Jamaica", "country_code": "1-876", "iso": "JM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Japan", "country_code": "81", "iso": "JP", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Jersey", "country_code": "44-1534", "iso": "JE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Jordan", "country_code": "962", "iso": "JO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kazakhstan", "country_code": "7", "iso": "KZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kenya", "country_code": "254", "iso": "KE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kiribati", "country_code": "686", "iso": "KI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kosovo", "country_code": "383", "iso": "XK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kuwait", "country_code": "965", "iso": "KW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Kyrgyzstan", "country_code": "996", "iso": "KG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Laos", "country_code": "856", "iso": "LA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Latvia", "country_code": "371", "iso": "LV", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Lebanon", "country_code": "961", "iso": "LB", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Lesotho", "country_code": "266", "iso": "LS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Liberia", "country_code": "231", "iso": "LR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Libya", "country_code": "218", "iso": "LY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Liechtenstein", "country_code": "423", "iso": "LI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Lithuania", "country_code": "370", "iso": "LT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Luxembourg", "country_code": "352", "iso": "LU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Macao", "country_code": "853", "iso": "MO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Macedonia", "country_code": "389", "iso": "MK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Madagascar", "country_code": "261", "iso": "MG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Malawi", "country_code": "265", "iso": "MW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Malaysia", "country_code": "60", "iso": "MY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Maldives", "country_code": "960", "iso": "MV", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mali", "country_code": "223", "iso": "ML", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Malta", "country_code": "356", "iso": "MT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Marshall Islands", "country_code": "692", "iso": "MH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mauritania", "country_code": "222", "iso": "MR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mauritius", "country_code": "230", "iso": "MU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mayotte", "country_code": "262", "iso": "YT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mexico", "country_code": "52", "iso": "MX", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Micronesia", "country_code": "691", "iso": "FM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Moldova", "country_code": "373", "iso": "MD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Monaco", "country_code": "377", "iso": "MC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mongolia", "country_code": "976", "iso": "MN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Montenegro", "country_code": "382", "iso": "ME", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Montserrat", "country_code": "1-664", "iso": "MS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Morocco", "country_code": "212", "iso": "MA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Mozambique", "country_code": "258", "iso": "MZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Myanmar", "country_code": "95", "iso": "MM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Namibia", "country_code": "264", "iso": "NA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Nauru", "country_code": "674", "iso": "NR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Nepal", "country_code": "977", "iso": "NP", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Netherlands", "country_code": "31", "iso": "NL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Netherlands Antilles", "country_code": "599", "iso": "AN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "New Caledonia", "country_code": "687", "iso": "NC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "New Zealand", "country_code": "64", "iso": "NZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Nicaragua", "country_code": "505", "iso": "NI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Niger", "country_code": "227", "iso": "NE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Nigeria", "country_code": "234", "iso": "NG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Niue", "country_code": "683", "iso": "NU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "North Korea", "country_code": "850", "iso": "KP", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Northern Mariana Islands", "country_code": "1-670", "iso": "MP", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Norway", "country_code": "47", "iso": "NO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Oman", "country_code": "968", "iso": "OM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Pakistan", "country_code": "92", "iso": "PK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Palau", "country_code": "680", "iso": "PW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Palestine", "country_code": "970", "iso": "PS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Panama", "country_code": "507", "iso": "PA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Papua New Guinea", "country_code": "675", "iso": "PG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Paraguay", "country_code": "595", "iso": "PY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Peru", "country_code": "51", "iso": "PE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Philippines", "country_code": "63", "iso": "PH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Pitcairn", "country_code": "64", "iso": "PN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Poland", "country_code": "48", "iso": "PL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Portugal", "country_code": "351", "iso": "PT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Puerto Rico", "country_code": "1-787, 1-939", "iso": "PR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Qatar", "country_code": "974", "iso": "QA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Republic of the Congo", "country_code": "242", "iso": "CG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Reunion", "country_code": "262", "iso": "RE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Romania", "country_code": "40", "iso": "RO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Russia", "country_code": "7", "iso": "RU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Rwanda", "country_code": "250", "iso": "RW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Barthelemy", "country_code": "590", "iso": "BL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Helena", "country_code": "290", "iso": "SH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Kitts and Nevis", "country_code": "1-869", "iso": "KN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Lucia", "country_code": "1-758", "iso": "LC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Martin", "country_code": "590", "iso": "MF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Pierre and Miquelon", "country_code": "508", "iso": "PM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saint Vincent and the Grenadines", "country_code": "1-784", "iso": "VC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Samoa", "country_code": "685", "iso": "WS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "San Marino", "country_code": "378", "iso": "SM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sao Tome and Principe", "country_code": "239", "iso": "ST", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Saudi Arabia", "country_code": "966", "iso": "SA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Senegal", "country_code": "221", "iso": "SN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Serbia", "country_code": "381", "iso": "RS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Seychelles", "country_code": "248", "iso": "SC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sierra Leone", "country_code": "232", "iso": "SL", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Singapore", "country_code": "65", "iso": "SG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sint Maarten", "country_code": "1-721", "iso": "SX", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Slovakia", "country_code": "421", "iso": "SK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Slovenia", "country_code": "386", "iso": "SI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Solomon Islands", "country_code": "677", "iso": "SB", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Somalia", "country_code": "252", "iso": "SO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "South Africa", "country_code": "27", "iso": "ZA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "South Korea", "country_code": "82", "iso": "KR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "South Sudan", "country_code": "211", "iso": "SS", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Spain", "country_code": "34", "iso": "ES", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sri Lanka", "country_code": "94", "iso": "LK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sudan", "country_code": "249", "iso": "SD", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Suriname", "country_code": "597", "iso": "SR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Svalbard and Jan Mayen", "country_code": "47", "iso": "SJ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Swaziland", "country_code": "268", "iso": "SZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Sweden", "country_code": "46", "iso": "SE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Switzerland", "country_code": "41", "iso": "CH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Syria", "country_code": "963", "iso": "SY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Taiwan", "country_code": "886", "iso": "TW", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tajikistan", "country_code": "992", "iso": "TJ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tanzania", "country_code": "255", "iso": "TZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Thailand", "country_code": "66", "iso": "TH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Togo", "country_code": "228", "iso": "TG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tokelau", "country_code": "690", "iso": "TK", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tonga", "country_code": "676", "iso": "TO", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Trinidad and Tobago", "country_code": "1-868", "iso": "TT", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tunisia", "country_code": "216", "iso": "TN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Turkey", "country_code": "90", "iso": "TR", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Turkmenistan", "country_code": "993", "iso": "TM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Turks and Caicos Islands", "country_code": "1-649", "iso": "TC", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Tuvalu", "country_code": "688", "iso": "TV", created_at: new Date(), updated_at: new Date() },
            { "country_name": "U.S. Virgin Islands", "country_code": "1-340", "iso": "VI", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Uganda", "country_code": "256", "iso": "UG", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Ukraine", "country_code": "380", "iso": "UA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "United Arab Emirates", "country_code": "971", "iso": "AE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "United Kingdom", "country_code": "44", "iso": "GB", created_at: new Date(), updated_at: new Date() },
            { "country_name": "United States", "country_code": "1", "iso": "US", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Uruguay", "country_code": "598", "iso": "UY", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Uzbekistan", "country_code": "998", "iso": "UZ", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Vanuatu", "country_code": "678", "iso": "VU", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Vatican", "country_code": "379", "iso": "VA", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Venezuela", "country_code": "58", "iso": "VE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Vietnam", "country_code": "84", "iso": "VN", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Wallis and Futuna", "country_code": "681", "iso": "WF", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Western Sahara", "country_code": "212", "iso": "EH", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Yemen", "country_code": "967", "iso": "YE", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Zambia", "country_code": "260", "iso": "ZM", created_at: new Date(), updated_at: new Date() },
            { "country_name": "Zimbabwe", "country_code": "263", "iso": "ZW", created_at: new Date(), updated_at: new Date() },
        ]
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });