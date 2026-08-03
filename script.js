const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const applicationId = "TTT-" + Math.floor(100000 + Math.random() * 900000);

    document.body.innerHTML = `
    <div style="
        min-height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#f4f7f6;
        font-family:Arial,sans-serif;
        flex-direction:column;
    ">
        <div style="
            width:70px;
            height:70px;
            border:8px solid #ddd;
            border-top:8px solid #006400;
            border-radius:50%;
            animation:spin 1s linear infinite;
        "></div>

        <h2 style="margin-top:20px;color:#006400;">
            Processing Your Application...
        </h2>

        <p>Please wait...</p>
    </div>

    <style>
    @keyframes spin{
        0%{transform:rotate(0deg);}
        100%{transform:rotate(360deg);}
    }
    </style>
    `;

    setTimeout(function () {
      document.body.innerHTML = `
<div style="
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f4f7f6;
    font-family:Arial,sans-serif;
    padding:20px;
">
    <div style="
        background:#fff;
        max-width:420px;
        width:100%;
        border-radius:20px;
        padding:30px;
        text-align:center;
        box-shadow:0 10px 30px rgba(0,0,0,.15);
    ">

        <div style="
            width:90px;
            height:90px;
            margin:auto;
            border-radius:50%;
            background:#16a34a;
            color:#fff;
            font-size:50px;
            display:flex;
            justify-content:center;
            align-items:center;
        ">✓</div>

        <h2 style="margin-top:20px;color:#0f172a;">
            Application Received
        </h2>

        <p style="color:#555;">
            Thank you for registering with
            <b>Honourable Ismail Sabon Garu Membership Registration Portal.</b>
            Your application has been received successfully.
        </p>

        <div style="
            background:#e8f8ee;
            padding:18px;
            border-radius:12px;
            margin:20px 0;
        ">
            <small>APPLICATION ID</small>
            <h3 style="color:#006400;">
                ${applicationId}
            </h3>
        </div>

        <div style="display:flex;gap:10px;">

            <button onclick="location.reload()" style="
                flex:1;
                padding:14px;
                background:#006400;
                color:#fff;
                border:none;
                border-radius:10px;
                cursor:pointer;
            ">
                Back To Home
            </button>

            <button onclick="showComingSoon()" style="
                flex:1;
                padding:14px;
                background:#1d4ed8;
                color:#fff;
                border:none;
                border-radius:10px;
                cursor:pointer;
            ">
                Print Your ID Card
            </button>

        </div>

    </div>
</div>
`;

    }, 5000);

});

function showComingSoon() {

document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f4f7f6;
font-family:Arial,sans-serif;
padding:20px;
">

<div style="
background:#fff;
max-width:420px;
width:100%;
padding:30px;
border-radius:20px;
text-align:center;
box-shadow:0 10px 30px rgba(0,0,0,.15);
">

<h2 style="color:#1d4ed8;">Coming Soon</h2>

<p style="margin:20px 0;color:#555;">
Your ID Card has not yet been approved by the Administrator.
</p>

<button onclick="location.reload()" style="
padding:14px 20px;
background:#006400;
color:#fff;
border:none;
border-radius:10px;
cursor:pointer;
">
Back To Home
</button>

</div>
</div>
`;
}

function adminWarning() {
    window.location.href = "admin.html";
        }
