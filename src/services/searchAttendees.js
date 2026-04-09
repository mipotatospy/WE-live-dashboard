function norm(value) {
    return (value || "").toString().trim().toLowerCase();
  }
  
  export function searchAttendeesInMemory(items, query, limit = 25) {
    const q = norm(query);
  
    if (!q) return [];
  
    const results = items.filter((item) => {
      const firstName = norm(item.first_name_lower || item.first_name);
      const lastName = norm(item.last_name_lower || item.last_name);
      const fullName = norm(item.full_name_lower || item.full_name);
      const company = norm(item.company_lower || item.company);
      const email = norm(item.email_lower || item.email);
      const joinCode = norm(item.join_code);
      const qrContent = norm(item.qr_content);
  
      return (
        firstName.includes(q) ||
        lastName.includes(q) ||
        fullName.includes(q) ||
        company.includes(q) ||
        email.includes(q) ||
        joinCode.includes(q) ||
        qrContent.includes(q)
      );
    });
  
    return results.slice(0, limit);
  }