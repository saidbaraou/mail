# Mail

**A full-stack email client interface built using Python, Django, and JavaScript.**

## 🌟 Project Context

This project is the final requirement for **Project 3: Mail** of Harvard's **CS50's Web Programming with Python and JavaScript** course. It implements a fully functional front-end for an email client using vanilla JavaScript to interact with a Django-based backend API, demonstrating proficiency in asynchronous programming and DOM manipulation.

## ✨ Features

The Mail application supports the core functionality expected of an email client, including:

* **View Mailboxes:** Users can switch between the **Inbox**, **Sent**, and **Archived** mailboxes.
* **Compose Email:** Users can send new emails, which are instantly displayed in the Sent mailbox upon successful delivery.
* **View Email:** Clicking on an email transitions to a detailed, single-email view.
* **Mark as Read/Unread:** Emails are automatically marked as read upon viewing. Users can toggle the read status.
* **Archive/Unarchive:** Users can move emails between the Inbox and the Archive.
* **Reply Functionality:** Provides a dedicated button to easily compose a reply, pre-filling fields like recipient, subject, and body.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3, Django | Provides the web application structure, routing, models (database), and API endpoints. |
| **Frontend Language** | JavaScript (ES6+) | Handles all dynamic updates, DOM manipulation, and asynchronous communication (Fetch API). |
| **Styling** | HTML5, CSS3, Bootstrap 4 | Used for the structural markup and responsive design/styling. |
| **Database** | SQLite (Default Django) | Used for persistent storage of user and email data. |

## 🚀 Getting Started

To set up and run the Mail application locally, follow these steps:

### Prerequisites

* Python 3.x
* `pip` (Python package installer)
* `git`

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://git@github.com/saidbaraou/mail.git](https://git@github.com/saidbaraou/mail.git)
    cd mail
    ```

2.  **Create and Activate a Virtual Environment:**
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run Migrations:**
    ```bash
    python manage.py makemigrations mail
    python manage.py migrate
    ```

5.  **Create a Superuser (Optional, for admin access):**
    ```bash
    python manage.py createsuperuser
    ```

### Running the Application

Start the Django development server:

```bash
python manage.py runserver
The application will be available at: http://127.0.0.1:8000/

You can register new users and start sending and receiving emails between them.
