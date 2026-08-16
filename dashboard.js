function createApplicantCard(item) {

  const data = item.data();

  const passport =
    data.passport || "logo.png";

  const voterCard =
    data.voterCard || "";

  const card =
    document.createElement("div");

  card.style.cssText = `
    background:#fff;
    padding:15px;
    margin-bottom:15px;
    border-radius:14px;
    box-shadow:0 2px 8px rgba(0,0,0,.10);
  `;

  card.innerHTML = `

    <!-- APPLICANT HEADER -->
    <div style="
      display:flex;
      gap:12px;
      align-items:center;
    ">

      <img
        src="${escapeHTML(passport)}"
        alt="Applicant Passport"
        loading="lazy"
        style="
          width:70px;
          height:70px;
          object-fit:cover;
          border-radius:10px;
          border:2px solid #006400;
          flex-shrink:0;
          background:#eee;
        "
      >

      <div style="
        flex:1;
        min-width:0;
      ">

        <h3 style="
          margin:0 0 6px;
          color:#006400;
          font-size:17px;
          word-break:break-word;
        ">

          ${escapeHTML(data.firstName)}
          ${escapeHTML(data.middleName)}
          ${escapeHTML(data.lastName)}

        </h3>

        <p style="
          margin:3px 0;
          font-size:13px;
          word-break:break-word;
        ">

          <b>ID:</b>
          ${escapeHTML(data.applicationId)}

        </p>

        <p style="
          margin:3px 0;
          font-size:13px;
        ">

          <b>Phone:</b>
          ${escapeHTML(data.phoneNumber)}

        </p>

      </div>

    </div>


    <!-- VOTER CARD -->
    <div style="
      margin-top:15px;
      padding-top:15px;
      border-top:1px solid #ddd;
    ">

      <h4 style="
        margin:0 0 10px;
        color:#006400;
        font-size:15px;
      ">
        Voter's Card
      </h4>

      ${
        voterCard
        ? `
          <img
            src="${escapeHTML(voterCard)}"
            alt="Voter's Card"
            loading="lazy"
            style="
              width:100%;
              max-width:500px;
              max-height:350px;
              object-fit:contain;
              display:block;
              margin:auto;
              border:2px solid #006400;
              border-radius:10px;
              background:#f3f4f6;
            "
          >
        `
        : `
          <div style="
            padding:15px;
            background:#f3f4f6;
            border-radius:8px;
            color:#777;
            text-align:center;
            font-size:13px;
          ">
            No Voter's Card uploaded
          </div>
        `
      }

    </div>


    <!-- DELETE -->
    <button
      onclick="deleteApplication('${item.id}')"
      style="
        width:100%;
        margin-top:15px;
        padding:10px;
        background:#dc2626;
        color:white;
        border:none;
        border-radius:8px;
        cursor:pointer;
        font-size:14px;
        font-weight:bold;
      "
    >
      🗑 Delete Application
    </button>

  `;

  return card;
}
