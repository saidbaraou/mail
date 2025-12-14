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
  document.querySelector('#single-email-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {

  const emailsView = document.querySelector('#emails-view');
  const composeView = document.querySelector('#compose-view');
  const singleEmailView = document.querySelector("#single-email-view");
  
  // Show the mailbox and hide other views
  emailsView.style.display = 'block';
  composeView.style.display = 'none';
  singleEmailView.style.display = 'none';

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

    //Checking wether response is an array before looping, displaying a message and stoping the function execution
    if(!Array.isArray(emails) || emails.length == 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = `Mailbox is empty`;
      emailListContainer.appendChild(emptyMessage);
      return
    }

    //Populate an emailDiv with every mail object property
      emails.forEach(email => {
      const emailDiv = document.createElement('div');

    //Add dataset attribute to be able to retrieve them  by their uniqueness
      emailDiv.setAttribute('data-key', email.id)

      const allRecipients = email.recipients.join(', ');
      
     // Sets the 'From:' or 'To:' label and value based on the mailbox type
      let role;
      const sent_mail = `To : ${allRecipients}`
      const received_mail = `From : ${email.sender}`

      if (mailbox === 'inbox') {
        role = received_mail;
      } else if (mailbox === 'sent') {
        role = sent_mail
      }

      email.read === true ? emailDiv.className = 'read-email-item' : emailDiv.className = 'email-item';

      emailDiv.innerHTML = ` 
        <div class="email-item-content d-flex p-2 justify-content-between align-items-center">
          <div class="d-flex align-items-baseline flex-grow-1 overflow-hidden">
            
            <p class="mb-0 mr-2 text-truncate">
                <strong>${role}</strong>
            </p>
            
            <p class="mb-0 text-truncate">
                ${email.subject}
            </p>
          </div>
        
          <div>
              <small class='text-secondary'>${email.timestamp}</small> 
          </div>
        </div>
      `;

      emailListContainer.appendChild(emailDiv)

      //Attached an event listener to each mail to view it when clicked on  
      emailDiv.addEventListener('click', (event) => view_email(event, mailbox));
    })

  })
  
  .catch(error => {
    console.error('Cannot get the mail:', error)
  })

}


function view_email(event, mailbox) {
  
const email_id = event.currentTarget.dataset.key

  mark_email_as_read(email_id);
    
  document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#single-email-view').style.display = 'block'
   document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email)
    console.log(`mailbox is ${mailbox}`)


    const singleEmailView = document.querySelector("#single-email-view")

      if(mailbox === 'inbox') {
          singleEmailView.innerHTML = `
      <div class = "container">
      {{request.user.email}}
      <div class=" mail-header-infos d-flex justify-content-between pt-3 border-bottom">
      <div class="email-contacts-infos">
      <p><strong>From : ${email?.sender}</strong></p>
      <p><strong> To : ${email?.recipients.join(', ')}</strong></p>
      </div>
      <div class=" timestamp text-secondary">
      <small>${email?.timestamp}</small>
      </div>
      </div>
      <div class=" email-subject py-2 border-bottom d-flex >
      <p class="align-items-center"><strong>subject : ${email?.subject}</strong></p>
      </div>
      <div class=" email-body py-3">
      <p>${email?.body}</p>
      </div>
      <div class="archive-unarchive">
      <button class="btn btn-sm btn-outline-primary" >${email.archived ? 'Unarchive' : 'Archive'}</button>
      </div>
      </div>
      `;
      } else if (mailbox === 'sent') {
          singleEmailView.innerHTML = `
      <div class = "container">
      {{request.user.email}}
      <div class=" mail-header-infos d-flex justify-content-between pt-3 border-bottom">
      <div class="email-contacts-infos">
      <p><strong>From : ${email?.sender}</strong></p>
      <p><strong> To : ${email?.recipients.join(', ')}</strong></p>
      </div>
      <div class=" timestamp text-secondary">
      <small>${email?.timestamp}</small>
      </div>
      </div>
      <div class=" email-subject py-2 border-bottom d-flex >
      <p class="align-items-center"><strong>subject : ${email?.subject}</strong></p>
      </div>
      <div class=" email-body py-3">
      <p>${email?.body}</p>
      </div>
      </div>
      `;
      }
  
  })
  .catch(error => {
    console.error('Cannot get the mail:', error)
  })
}


function mark_email_as_read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
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