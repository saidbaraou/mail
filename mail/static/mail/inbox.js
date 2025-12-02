document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Use button to send mail
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

  const emailsView = document.querySelector('#emails-view');
  const composeView = document.querySelector('#compose-view');
  
  // Show the mailbox and hide other views
  emailsView.style.display = 'block';
  composeView.style.display = 'none';

  // Show the mailbox name
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
  <div id="email-list-container"></div>
  `;
  

  get_emails(mailbox);

}

const get_emails = function (mailbox) {

  //fetch emails accordingly to the mailbox requested 
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    console.log(emails); 

    //Create the element inside the ASYNC block, to be sure the element had time to be added to the DOM
     const emailListContainer = document.querySelector('#email-list-container');

     //To check the element had arrived
     if(!emailListContainer){
      console.log('No list container found');
      return
     }

    //Checking wether response is an array before looping, displaying a message and stoping the function execution
    if(!Array.isArray(emails) || emails.length == 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = `No mail found`;
      emailListContainer.appendChild(emptyMessage);
      return
    }

    //Populate an emailDiv with every mail object property
      emails.forEach(email => {
      const emailDiv = document.createElement('div');

    //Add dataset attribute to be able to retrieve them  by their uniqueness
      emailDiv.setAttribute('data-key', email.id)

      const allRecipients = email.recipients.join(', ');

      emailDiv.className = 'email-item';

      emailDiv.innerHTML = ` 
        <p><strong>From: ${allRecipients}</strong></p>
        <p><strong>Subject: ${email.subject}</strong></p>
        <small class='text-secondary'>${email.timestamp}</small>    
      `;

      emailListContainer.appendChild(emailDiv)

      //Attached an event listener to each mail to view it when clicked on  
      emailDiv.addEventListener('click', () => view_email())
    })

  })
  
  .catch(error => {
    console.error('Cannot get the mail:', error)
  })

}

function view_email(event) {
  
  
}


function send_email(event) {

  event.preventDefault()

  //Getting the value of different fields
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //Send the fields data to the server
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    
     load_mailbox('sent');
  })
  .catch(error => {
    console.error('Sending mail failed:', error);
  })

}