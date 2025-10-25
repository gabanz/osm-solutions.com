export async function onRequestPost(context) {
  try {
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

    const resendApiKey = context.env.RESEND_API_KEY;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "no-reply@osm-solutions.com",
        to: "info@osm-solutions.com",
        subject: `New contact form submission from ${data.name}`,
        reply_to: data.email,
        text: emailBody,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      return Response.json({ message: "✅ Thank you! Your message has been sent." });
    } else {
      console.error("Resend API error:", result);
      return Response.json({
        message: `❌ Failed to send message (${res.status}): ${JSON.stringify(result)}`,
      }, { status: res.status });
    }
  } catch (err) {
    console.error("Worker error:", err);
    return Response.json({ message: "❌ Internal error." }, { status: 500 });
  }
}
