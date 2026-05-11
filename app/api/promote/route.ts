// PATCH: Admin approves a reviewer

export async function PATCH(request: Request) {
  // Approve reviewer logic
  return new Response('Reviewer promoted', { status: 200 });
}
