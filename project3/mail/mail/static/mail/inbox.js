document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email); 

  
  // Compose 
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#container').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#container').style.display = 'none';


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // Loops for mails.
      emails.forEach(contents => {
        // Create the Div for each mail
        // Parent Div
        const mail = document.createElement('div');
        // Child Div
        const mailSender = document.createElement('div');
        const mailSubject = document.createElement('div');
        const mailTime = document.createElement('div');
        
        // Create anchor tag for individual mail
        const mailTag = document.createElement('a');
        mailTag.setAttribute('onclick', "return view_email('" + contents.id + "')");

        // Name the Parent Div
        mail.className = 'mailbox';
        // Name the Child Div
        mailSender.className = 'mailbox_sender';
        mailSubject.className = 'mailbox_subject';
        mailTime.className = 'mailbox_time';

        

        // Add the contents inside Child Div
        mailSender.innerHTML = contents.sender;
        mailSubject.innerHTML = contents.subject;
        mailTime.innerHTML = contents.timestamp;
        // Set link for individual mail
        mailTag.href = "#";


        // fill the div with contents into each mail
        mail.appendChild(mailSender);
        mail.appendChild(mailSubject);
        mail.appendChild(mailTime);
        // add the done mail into anchor tag area
        mailTag.appendChild(mail);

        // If the mail is unread, turn background-color to grey, else white.
        if (contents.read === true) {
          mail.style.backgroundColor = 'white';
        } else {
          mail.style.backgroundColor = 'rgba(128, 128, 128, 0.14)';
        }

        // add the done-looping emails into the emails-views for ultimately show
        document.querySelector('#emails-view').append(mailTag);
      });


  });
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}


function send_email(e) {
    e.preventDefault();

    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
  
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then((response) => {
      console.log(response)
      return response.json();
    })
    .then(result => {
      // Print result
      console.log(result);
      if (result.error === undefined) {
        load_mailbox('sent');
      };
    });

};


function view_email(mail_id){

  // Show container view and hide emails view
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#container').style.display = 'block';

  // Clear out composition fields

  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
      document.querySelector('#container-sender').innerHTML = email.sender;
      document.querySelector('#container-recipients').innerHTML = email.recipients;
      document.querySelector('#container-subject').innerHTML = email.subject;
      document.querySelector('#container-body').innerHTML= email.body;
      document.querySelector('#container-timestamp').innerHTML = email.timestamp;

      read_email(mail_id);
  });
}

function read_email(mail_id) {

  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}