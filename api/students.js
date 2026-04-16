const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function send(res, status, payload) {
  res.status(status).json(payload);
}

module.exports = async (req, res) => {
  try {
    // GET: Fetch all students
    if (req.method === "GET") {
      const { data, error } = await supabase.from('students').select('uid, name');
      
      if (error) {
        if (error.code === 'PGRST205') return send(res, 200, {}); // Table doesn't exist yet
        throw error;
      }
      
      const studentsMap = {};
      if (data) {
        data.forEach(row => {
          studentsMap[row.uid] = row.name;
        });
      }

      return send(res, 200, studentsMap);
    }
  } catch (err) {
    console.error('API Error:', err);
    return send(res, 500, { error: "API Error: " + err.message });
  }

  res.setHeader("Allow", "GET");
  return send(res, 405, { error: "Method not allowed" });
};