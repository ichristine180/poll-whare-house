import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PollStatsEmailOptions {
  to: string
  question: string
  slug: string
  totalVotes: number
  options: { text: string; votes: number; percentage: number }[]
}

export async function sendPollStatsEmail({
  to,
  question,
  slug,
  totalVotes,
  options,
}: PollStatsEmailOptions): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const pollUrl = `${siteUrl}/poll/${slug}`

  const optionsHtml = options
    .map(
      (opt) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">${opt.text}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;text-align:center;">${opt.votes}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;text-align:center;">${opt.percentage}%</td>
      </tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111827;">
      <h2 style="color:#4f46e5;margin-bottom:4px;">Your poll just hit 10 votes!</h2>
      <p style="color:#6b7280;margin-top:0;">Here's how it's going so far.</p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-weight:600;font-size:16px;">${question}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280;font-weight:600;">Option</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;font-weight:600;">Votes</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280;font-weight:600;">%</th>
          </tr>
        </thead>
        <tbody>${optionsHtml}</tbody>
        <tfoot>
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#111827;">Total</td>
            <td style="padding:8px 12px;font-weight:600;color:#111827;text-align:center;">${totalVotes}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <a href="${pollUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">View Your Poll</a>
      <p style="margin-top:12px;font-size:13px;color:#9ca3af;">Poll link: <a href="${pollUrl}" style="color:#4f46e5;">${pollUrl}</a></p>
    </div>
  `

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'PollWarehouse <no-reply@pollwarehouse.com>',
    to,
    subject: `Your poll just hit 10 votes — "${question}"`,
    html,
  })

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`)
  }
}
