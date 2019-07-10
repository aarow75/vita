# The Synoptic "Life of Adam and Eve"
With comparisons to the Latin, Greek, Armenian, Georgian, and Slavonic. Also including cross references to the 1 Book of Enoch, Book of Jubilees, and LDS Book of Abraham and Book of Moses. Other comparisons with the Syriac Cave of Treasures, Koran, and various targums and midrash.

`vita.json` contains the manuscript version, title, year of translation, and number of manuscripts the translation is based from. This provides the column header information

`pericope.json` gives an `id`, title and list of manuscript sources that exist for that pericope. This is a way to topically group the related content. Potentially, it will include links to additional information about that pericope where the topic is expanding in other manuscripts (i.e. Fall of Satan manuscripts that fall outside of these primary manuscripts, or references to Ugarit, Book of Jubilees, or other sources that are related). The pericope id is generally numbered in a chronological order, which mostly but is not necessarily the order found in the manuscripts themselves.

`greek.json`, `armenian.json`, `georgian.json`, `latin.json`, `slavonic.json` contain the content of the manuscripts, divided by pericope id, which stated above, is not necessarily the order found in the manuscript. Each `content` in the pericope group is in it's natural manuscript order, with the scholars numbering in bold.

`bible.json` is directly related to the above json files, grouped by pericope, showing the related Genesis verses.

`references.json` is also related to the above json files, including `bible.json` that include other document references (Book of Enoch, New Testament, Old Testament, etc.) that are related.