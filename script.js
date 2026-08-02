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
            color:white;
            font-size:50px;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            ✓
        </div>

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
            <h3 style="margin:10px 0;color:#006400;">
                ${applicationId}
            </h3>
        </div>

        <button onclick="location.reload()" style="
            width:100%;
            padding:15px;
            background:#006400;
            color:white;
            border:none;
            border-radius:10px;
            font-size:18px;
        ">
            Back To Home
        </button>

    </div>
    </div>
    `;
});
