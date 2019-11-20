function buildAddOn(e) {
	var accessToken = e.messageMetadata.accessToken;
	GmailApp.setCurrentMessageAccessToken(accessToken);

	var messageId = e.messageMetadata.messageId;
	var message = GmailApp.getMessageById(messageId);

	var sender = message.getFrom();
	var body = message.getPlainBody();
	var receiver = message.getTo();
	var received = message.getDate();

	var formData = {
		"sender": sender,
		"receiver": receiver,
		"body": body,
		"received": received,
		"Authentication": "w7dDaXw5yo"
	}

	var options = {
		'method': 'post',
		'payload': formData
	};
    
    var sadFaceImg= CardService.newImage().setAltText("Error").setImageUrl("https://www.searchpng.com/wp-content/uploads/2019/02/Sad-Facebook-Emoji-PNG-Image-715x715.png");
	var headerImage = CardService.newImage().setAltText("LOGO").setImageUrl("https://www.dropbox.com/s/aqq03fuvkr5dwbl/logo.png?raw=1");
	var confidenceImage = CardService.newImage().setAltText("Confidence Level");
	var resultsImage = CardService.newImage().setAltText("Test results");
    var error = CardService.newTextParagraph();
  
    var howWeDidIt = CardService.newImage().setAltText("How we calculated our results:");
	howWeDidIt.setImageUrl("https://www.dropbox.com/s/e5jsclmmj7rrrf8/how.png?raw=1");
	howWeDidIt.setOpenLink(CardService.newOpenLink().setUrl('https://practical-roentgen-6e9cc1.netlify.com/howtocheck'));

	var section = CardService.newCardSection().setHeader("<font color=\"#1257e0\"><b> </b></font>"); // used to say Mass Email,removed because otherwise we had 3 lines saying Mass Email 
	var error = CardService.newTextParagraph();
  
	var fetch = UrlFetchApp.fetch("https://flee-mail.herokuapp.com/emails/503", {
		muteHttpExceptions: true
	});

	if (fetch.getResponseCode() == 503) {                                                      //if 503 returned i.e server crashes
		Logger.log("Web page not found");
		
		error.setText(" <b> Our Servers are down at the moment. Please try again later!</b>");
        section.addWidget(sadFaceImg);
        section.addWidget(error);

	} else {                                                                                  //only queries if server is up and running
		var response = JSON.parse(UrlFetchApp.fetch("https://flee-mail.herokuapp.com/emails", options));

		var confidencePar = CardService.newTextParagraph();
		if (response.checked == 0) {
			confidenceImage.setImageUrl("https://www.dropbox.com/s/nx51v2hh3414mlo/low.png?raw=1");
		} else if (response.checked < 5) {
			confidenceImage.setImageUrl("https://www.dropbox.com/s/8tjfpklsbikzq65/moderate.png?raw=1");
		} else {
			confidenceImage.setImageUrl("https://www.dropbox.com/s/uiv771pgqir9z2z/high.png?raw=1");
		}

		if (response.matches > 0) {
			resultsImage.setImageUrl("https://www.dropbox.com/s/1tqoslycqmk8gl0/false.png?raw=1"); //red cross image
		} else {
			resultsImage.setImageUrl("https://www.dropbox.com/s/02w2163p6b4axn4/true.png?raw=1"); //green tick image
		}
        
        section.addWidget(headerImage);
        section.addWidget(resultsImage);
        section.addWidget(confidenceImage);
        section.addWidget(howWeDidIt);
        section.addWidget(error);

	}

	

	var card = CardService.newCardBuilder()
		.addSection(section)
		.build();

	return [card];
}