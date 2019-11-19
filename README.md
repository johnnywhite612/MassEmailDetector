# Flee-Mail Backend ![](img/icon.png)

This is the backend code for the Flee-Mail Mass Email
Detector. `package.json` and `package-lock.json` are configuration
files for Node.js specifying libraries. The source code for this
application lives in the `app/` directory. `app/app.js` provides the main
functionality of handling incoming connections and adding messages to our
database. `app/med.js` provides the functionality for comparing an email
against our database. `app/levenshtein.js` and `app/levenshtein_util.js`
are modified parts of the [edit-distance-js] library. They are included in
`app/` since the functionality of `app/med.js` depends on them.
Additionally, a copy of the app's icon and logo are contained in the
`img/` directory.

## License

This project uses [SPDX-License-Identifiers] to specify the licensing
of individual files. Some code in this repository is a modified copy of
[edit-distance-js], which is licensed under the Apache License version
2.0. The rest of the files is licensed under the GNU Affero General Public
License version 3.0 or later. A copy of these licenses is available in
the LICENSE directory.

[SPDX-License-Identifiers]: https://spdx.org
[edit-distance-js]: https://github.com/schulzch/edit-distance-js
