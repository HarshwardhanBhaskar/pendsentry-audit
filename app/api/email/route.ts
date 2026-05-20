import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, totalMonthlySavings, totalAnnualSavings, shareUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing destination email.' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    let emailSent = false;
    let details = 'Logged locally (Development Fallback)';

    // Fallback template logged to console in dev mode
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0;">SpendSentry AI Spend Audit</h2>
          <span style="font-size: 12px; color: #64748b;">Powered by Credex</span>
        </div>
        <p>Hello,</p>
        <p>Thank you for auditing your startup's AI spend. We have successfully compiled your cost-reduction report.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #065f46;">🔒 Savings Identified!</h3>
          <p style="margin: 5px 0;"><strong>Estimated Monthly Savings:</strong> $${totalMonthlySavings}/mo</p>
          <p style="margin: 5px 0;"><strong>Estimated Annual Savings:</strong> $${totalAnnualSavings}/yr</p>
        </div>

        <p>You can access your complete interactive results dashboard and share it with your finance team at any time using your unique public URL:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${shareUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Full Audit Report</a>
        </div>

        ${
          totalMonthlySavings >= 500
            ? `<div style="background-color: #eff6ff; border: 1px dashed #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                 <h4 style="margin-top: 0; color: #1e40af;">💸 Capture Your Discount through Credex</h4>
                 <p style="margin: 0; font-size: 14px; color: #1e3a8a;">Your monthly spend qualifies you for a direct 20-30% discount on Cursor, Claude, and OpenAI infrastructure through Credex surplus credits. A Credex advisor will reach out to you shortly, or you can schedule a call directly to claim your savings.</p>
               </div>`
            : ''
        }

        <p style="font-size: 12px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          SpendSentry is a free tool provided by Credex. Sourcing surplus corporate credits to slash startup infrastructure burn. Visit us at <a href="https://credex.rocks">credex.rocks</a>.
        </p>
      </div>
    `;

    if (resendKey && resendKey !== 'your_resend_api_key') {
      try {
        const resend = new Resend(resendKey);
        const { data, error } = await resend.emails.send({
          from: 'SpendSentry <audits@spendsentry.com>', // Note: in sandbox mode, Resend sends from onboarding@resend.dev
          to: email,
          subject: `Your AI Spend Audit Report — $${totalMonthlySavings}/mo in savings identified`,
          html: emailHtml,
        });

        if (error) {
          console.error('Resend Transactional Email Error:', error.message);
        } else if (data) {
          emailSent = true;
          details = `Dispatched successfully via Resend. ID: ${data.id}`;
        }
      } catch (resendError) {
        const errMsg = resendError instanceof Error ? resendError.message : String(resendError);
        console.error('Resend API Call Failed, logging local fallback details:', errMsg);
      }
    } else {
      console.log('--------------------------------------------------');
      console.log('MOCK TRANSACTIONAL EMAIL DISPATCHED (DEV MODE)');
      console.log(`To: ${email}`);
      console.log(`Subject: Your AI Spend Audit Report — $${totalMonthlySavings}/mo saved`);
      console.log(`Share Link: ${shareUrl}`);
      console.log('--------------------------------------------------');
    }

    return NextResponse.json({
      success: true,
      sent: emailSent,
      details,
    });
  } catch (error) {
    console.error('Email API Endpoint Error:', error);
    return NextResponse.json({ error: 'Failed to dispatch email confirmation.' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
