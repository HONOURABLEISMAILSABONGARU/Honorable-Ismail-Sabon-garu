const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const applicationId = "TTT-" + Math.floor(100000 + Math.random() * 900000);

    // Processing Screen
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

    setTimeout(function(){

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
<div style="
    display:flex;
    gap:10px;
    margin-top:20px;
">

<button onclick="location.reload()" style="
    flex:1;
    padding:15px;
    background:#006400;
    color:white;
    border:none;
    border-radius:10px;
    font-size:16px;
    cursor:pointer;
">
    Back To Home
</button>

<button onclick="showComingSoon()" style="
    flex:1;
    padding:15px;
    background:#1d4ed8;
    color:white;
    border:none;
    border-radius:10px;
    font-size:16px;
    cursor:pointer;
">
    Print Your ID Card
</button>

</div>
            

        </div>
        </div>
        `;

    },2000);

});
function showComingSoon(){

document.body.innerHTML=`

<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#f4f7f6,#eaf4ee);
font-family:Arial,sans-serif;
padding:20px;
">

<div style="
background:#fff;
max-width:430px;
width:100%;
padding:30px;
border-radius:20px;
text-align:center;
box-shadow:0 10px 30px rgba(0,0,0,.15);
border-top:6px solid #006400;
">

<div style="
width:90px;
height:90px;
margin:auto;
border-radius:50%;
background:#1d4ed8;
color:#fff;
font-size:45px;
display:flex;
justify-content:center;
align-items:center;
">
🪪
</div>

<h2 style="
margin-top:20px;
color:#1d4ed8;
">
Coming Soon
</h2>

<p style="
color:#555;
line-height:1.7;
margin-top:15px;
">
Your ID Card has not been approved by the administrator.<br><br>

Please wait for administrator approval.
</p>

<div style="
display:flex;
gap:10px;
margin-top:25px;
">

<button onclick="location.reload()" style="
flex:1;
padding:14px;
background:#006400;
color:white;
border:none;
border-radius:10px;
font-size:16px;
cursor:pointer;
">
Back To Home
</button>

<button onclick="showComingSoon()" style="
flex:1;
padding:14px;
background:#1d4ed8;
color:white;
border:none;
border-radius:10px;
font-size:16px;
cursor:pointer;
">
Check Again
</button>

</div>

</div>

</div>

`;
}
