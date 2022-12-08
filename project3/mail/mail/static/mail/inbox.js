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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(contents => {
        const mail = document.createElement('div');
        const mailSender = document.createElement('div');
        const mailSubject = document.createElement('div');
        const mailTime = document.createElement('div');

        mail.className = 'mailbox';
        mailSender.className = 'mailbox_sender';
        mailSubject.className = 'mailbox_subject';
        mailTime.className = 'mailbox_time';

        mailSender.innerHTML = contents.sender;
        mailSubject.innerHTML = contents.subject;
        mailTime.innerHTML = contents.timestamp;

        mail.appendChild(mailSender);
        mail.appendChild(mailSubject);
        mail.appendChild(mailTime);
        if (contents.read === true) {
          mail.style.backgroundColor = 'white';
        } else {
          mail.style.backgroundColor = 'rgba(128, 128, 128, 0.19)';
        }

        document.querySelector('#emails-view').append(mail);
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
