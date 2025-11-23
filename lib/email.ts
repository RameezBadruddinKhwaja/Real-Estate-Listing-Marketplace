/**
 * Email notification service
 * Configure with your preferred email provider (SendGrid, Resend, etc.)
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, from = 'Prime Properties <noreply@primeproperties.com>' } = options

  // TODO: Implement with your email provider
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  await sgMail.send({
    to,
    from,
    subject,
    html,
  })
  */

  // For development, just log
  console.log('Email would be sent:', { to, subject, from })
}

export async function sendLeadNotification(lead: any, property: any, agent: any) {
  const html = `
    <h2>New Lead Received!</h2>
    <p>You have received a new inquiry for your property listing.</p>

    <h3>Property Details:</h3>
    <ul>
      <li><strong>Title:</strong> ${property.title}</li>
      <li><strong>Price:</strong> PKR ${property.price.toLocaleString()}</li>
    </ul>

    <h3>Lead Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${lead.name}</li>
      <li><strong>Email:</strong> ${lead.email}</li>
      <li><strong>Phone:</strong> ${lead.phone}</li>
      <li><strong>Message:</strong> ${lead.message}</li>
    </ul>

    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/agent/leads"
         style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
        View in Dashboard
      </a>
    </p>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      This is an automated notification from Prime Properties.
    </p>
  `

  await sendEmail({
    to: agent.email,
    subject: `New Lead for ${property.title}`,
    html,
  })
}

export async function sendWelcomeEmail(user: any) {
  const html = `
    <h2>Welcome to Prime Properties!</h2>
    <p>Thank you for joining Prime Properties, your trusted partner in finding the perfect home.</p>

    <h3>Get Started:</h3>
    <ul>
      <li>Browse thousands of property listings</li>
      <li>Save your favorite properties</li>
      <li>Contact agents directly</li>
      <li>Get AI-powered property recommendations</li>
    </ul>

    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}"
         style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
        Start Browsing
      </a>
    </p>

    <p>If you have any questions, feel free to contact our support team.</p>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Prime Properties Team
    </p>
  `

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Prime Properties!',
    html,
  })
}

export async function sendPropertyApprovalEmail(property: any, agent: any) {
  const html = `
    <h2>Property Approved!</h2>
    <p>Great news! Your property listing has been approved and is now live on Prime Properties.</p>

    <h3>Property Details:</h3>
    <ul>
      <li><strong>Title:</strong> ${property.title}</li>
      <li><strong>Price:</strong> PKR ${property.price.toLocaleString()}</li>
      <li><strong>Location:</strong> ${property.location?.name}</li>
    </ul>

    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/property/${property.id}"
         style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
        View Property
      </a>
    </p>

    <p>Your listing is now visible to thousands of potential buyers!</p>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Prime Properties Team
    </p>
  `

  await sendEmail({
    to: agent.email,
    subject: 'Your Property Listing is Now Live!',
    html,
  })
}
