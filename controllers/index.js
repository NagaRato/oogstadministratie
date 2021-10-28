var index = {
	closeAllPages: function() {
		pages = document.getElementsByClassName("page");
		for (var i = 0; i < pages.length; i++) {
			pages[i].style.display = "none";
		}
	},

	openPage: function(pageId) {
		index.closeAllPages();
		document.getElementById("page"+pageId).style.display = "block";
	},

	addedCertificateNumbers: function() {
		var certnrs = [];
		var lowestCertiNr = 0;
		var highestCertiNr = 0;
		var containsOnlyPositiveNumbers = true;
		for (var i = document.getElementById("inputcertificatenumbers").value.split('\n').length-1; i >= 0; i--) {
			if (document.getElementById("inputcertificatenumbers").value.split('\n')[i].match(/^[0-9]+$/) == null) {
				containsOnlyPositiveNumbers = false;
			}
			else {
				certnrs[certnrs.length] = parseInt(document.getElementById("inputcertificatenumbers").value.split('\n')[i], 10);
			}
		}

		if (certnrs.length != 0 && containsOnlyPositiveNumbers) {
			lowestCertiNr = certnrs[0];
			highestCertiNr = certnrs[0];

			for (var i = 0; i < certnrs.length; i++) {
				if (certnrs[i] < lowestCertiNr) {
					lowestCertiNr = certnrs[i];
				}
				if (certnrs[i] > highestCertiNr) {
					highestCertiNr = certnrs[i];
				}
				document.getElementById('inputLowestCertiNr').disabled = false;
				document.getElementById('inputHighestCertiNr').disabled = false;
				document.getElementById('inputLowestCertiNr').value = lowestCertiNr;
				document.getElementById('inputLowestCertiNr').max = lowestCertiNr;
				document.getElementById('inputHighestCertiNr').value = highestCertiNr;
				document.getElementById('inputHighestCertiNr').min = highestCertiNr;
			}
		}
		else {
			document.getElementById('inputLowestCertiNr').disabled = true;
			document.getElementById('inputHighestCertiNr').disabled = true;
		}
	},

	renderFrontOfficeList: function() {
		var certificatenumbersWithLeadingZeros = document.getElementById("inputcertificatenumbers").value.split('\n');
		var certificatenumbers = [];
		for (var i = 0; i < certificatenumbersWithLeadingZeros.length; i++) {
			certificatenumbers[certificatenumbers.length] = parseInt(certificatenumbersWithLeadingZeros[i], 10)+"";
		}
		var names = document.getElementById("inputnames").value.split('\n');
		var mouths = document.getElementById("inputmouths").value.split('\n');

		var result = index.validate(certificatenumbers, names, mouths);
		if (result == "") {
			$("#frontOfficeList th").remove();
			$("#frontOfficeList tr").remove();

			document.getElementById('frontOfficeList').appendChild(index.createFrontOfficeTablehead());
			for (var i = document.getElementById('inputLowestCertiNr').value; i <= document.getElementById('inputHighestCertiNr').value; i++) {
				var row = document.createElement('tr');

				var cellnr = document.createElement('td');
				cellnr.innerHTML = i;
				row.appendChild(cellnr);

				var cellname = document.createElement('td');
				if (certificatenumbers.indexOf(i+"") >= 0) {
					cellname.innerHTML = names[certificatenumbers.indexOf(i+"")];
				}
				else {
					var textboxName = document.createElement("input");
					textboxName.type = "text";
					cellname.appendChild(textboxName);
				}
				row.appendChild(cellname);

				var cellmouths = document.createElement('td');
				if (certificatenumbers.indexOf(i+"") >= 0) {
					cellmouths.innerHTML = mouths[certificatenumbers.indexOf(i+"")];
				}
				else {
					var textmouths = document.createElement("input");
					textmouths.type = "num";
					cellmouths.appendChild(textmouths);
				}
				row.appendChild(cellmouths);
				document.getElementById('frontOfficeList').appendChild(row);
			}
		}
		else {
			window.alert(result);
		}
	},

	createFrontOfficeTablehead: function() {
		var row = document.createElement("tr");
		row.id = 'outputhead';
		var nrrow = document.createElement('td');
		nrrow.innerHTML = "cert.nr.";
		row.appendChild(nrrow);
		var namesrow = document.createElement('td');
		namesrow.innerHTML = "naam";
		row.appendChild(namesrow);
		var mouthsrow = document.createElement('td');
		mouthsrow.innerHTML = "monden";
		row.appendChild(mouthsrow);
		return row;
	},

	validate: function(certnrs, names, mouths) {
		var result = "";

		while (certnrs.length != 0 && (certnrs[certnrs.length-1] == undefined || certnrs[certnrs.length-1] == "" || certnrs[certnrs.length-1] == " ")) {
			certnrs.length = certnrs.length-1;
		}
		while (names.length != 0 && (names[names.length-1] == undefined || names[names.length-1] == "" || names[names.length-1] == " ")) {
			names.length = names.length-1;
		}
		while (mouths.length != 0 && (mouths[mouths.length-1] == undefined || mouths[mouths.length-1] == "" || mouths[mouths.length-1] == " ")) {
			mouths.length = mouths.length-1;
		}

		if (certnrs.length == 1 || certnrs[0] == undefined || certnrs[0] == "\n" || certnrs[0] == "" || certnrs[0] == " ") {
			result = "Er zijn te weinig certificaatnummers ingevuld.";
		}

		if (result = "" || names.length == 1 || names[0] == undefined || names[0] == "\n" || names[0] == "" || names[0] == " ") {
			result = "Er zijn te weinig namen ingevuld.";
		}

		if (result = "" || mouths.length == 1 || mouths[0] == undefined || mouths[0] == "\n" || mouths[0] == "" || mouths[0] == " ") {
			result = "Er zijn te weinig mondaantallen ingevuld.";
		}

		if (result = "" || certnrs.length != names.length || certnrs.length != mouths.length) {
			result = "De lijsten met certificaatnummers, namen en monden zijn niet even lang.";
		}

		if (result == "") {
			for (var i = certnrs.length-1; i >= 0; i--) {
				if (certnrs[i].match(/^[0-9]+$/) == null) {
					result = "In het vak met certificaatnummers zitten niet alleen positieve gehele nummers.";
				}
			}
		}

		if (result == "") {
			for (var i = mouths.length-1; i >= 0; i--) {
				if (mouths[i].match(/^[0-9]+$/) == null) {
					result = "In het vak met certificaatnummers zitten niet alleen positieve gehele nummers.";
				}
			}
		}

		if (result == "" && index.hasDuplicates(certnrs)) {
			result = "Er zijn dubbele certificaatnummers gevonden.";
		}

		return result;
	},

	hasDuplicates: function(elements) {
		var containsDuplicates = false;
		var elementsSoFar = [];
		for (var i = 0; i < elements.length; i++) {
			if (elementsSoFar.includes(elements[i])) {
				containsDuplicates = true;
				i = elements.length;
			}
			else {
				elementsSoFar.push(elements[i]);
			}
		}
		return containsDuplicates;
	}
}
