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
      emails.forEach((contents) => {
        // Create the Div for each mail
        // Parent Div
        const mail = document.createElement('div');
        // Child Div
        const mailHeader = document.createElement('div');
        const mailSubject = document.createElement('div');
        const mailTime = document.createElement('div');
        
        // Create anchor tag for individual mail
        const mailTag = document.createElement('a');
        
        mailTag.setAttribute('data-code', contents.id);
        mailTag.onclick = function(e) {
          e.preventDefault();
          view_email(this.getAttribute("data-code"));
        }

        // Name the Parent Div
        mail.className = 'mailbox';
        // Name the Child Div
        mailHeader.className = 'mailbox_header';
        mailSubject.className = 'mailbox_subject';
        mailTime.className = 'mailbox_time';
        
        // Add the contents inside Child Div
        // Difference of the header between Sent & other mailboxes
        if (mailbox == 'sent') {
          mailHeader.innerHTML = contents.recipients;
        } else {
          mailHeader.innerHTML = contents.sender;
        };

        mailSubject.innerHTML = contents.subject;
        mailTime.innerHTML = contents.timestamp;
        

        // add the Child div into the mail div
        mail.appendChild(mailHeader);
        mail.appendChild(mailSubject);
        mail.appendChild(mailTime);
        // add the done mail div into anchor tag area
        mailTag.appendChild(mail);

        // If the mail is unread, turn background-color to grey, else white
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
      console.log(response);
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

      // function READ
      if(!email.read) {
        read_email(mail_id);
      };

      // Show the button of Archive or Unarchive.
      user = document.querySelector('h2').innerHTML;
      if (user == email.sender) {
        document.querySelector('#archive').style.display = 'none';
        document.querySelector('#unarchive').style.display = 'none';
      } else if (!email.archived) {
        document.querySelector('#archive').style.display = 'block';
        document.querySelector('#unarchive').style.display = 'none';
      } else if (email.archived) {
        document.querySelector('#archive').style.display = 'none';
        document.querySelector('#unarchive').style.display = 'block';
      }

      // Define the function for the button on click.
      document.querySelector('#archive').onclick = () => archive(mail_id);
      document.querySelector('#unarchive').onclick = () => unarchive(mail_id);
  });
}

function read_email(mail_id) {

  // Turn the status of email to Read
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function archive(mail_id) {

  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  
  load_mailbox('inbox');
};

function unarchive(mail_id) {

  fetch(`/emails/${mail_id}`,{
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })

  load_mailbox('inbox');
}