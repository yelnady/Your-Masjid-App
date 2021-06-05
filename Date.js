import "hijri-date";
import moment from "moment";

const HijriMonths = [
  "Muharram",
  "Safar",
  "Rabii al-Awwal",
  "Rabii al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhirah",
  "Rajab",
  "Shaaban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qaadah",
  "Dhu al-Hijjah",
];

export function getGDate(gdate) {
  return gdate.format("ddd") + ", " + gdate.format("MMM") + " " + gdate.date();
}
export function getHDate(hMomentDate = moment()) {
  const Greg = hMomentDate.toDate();
  const hDate = Greg.toHijri();
  return HijriMonths[hDate.month - 1] + " " + hDate.date + ", " + hDate.year;
}
