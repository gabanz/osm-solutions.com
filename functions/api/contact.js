export async function onRequestPost(context) {
  const data = await context.request.json();

  if (!data.name || !data.email || !data.message) {
    return Response.json({ message: "All fields are required." }, { status: 400 });
  }

  const emailBody = `
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
  `;

  const mail = {
    personalizations: [{ to: [{ email: "info@osm-solutions.com" }] }],
    from: { email: "noreply@osm-solutions.com" },
    subject: `New contact form submission from ${data.name}`,
    content: [{ type: "text/plain", value: emailBody }]
  };

  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mail)
  });

  if (res.ok) {
    return Response.json({ message: "✅ Thank you! Your message has been sent." });
  } else {
    return Response.json({ message: "❌ Failed to send message." }, { status: 500 });
  }
}

