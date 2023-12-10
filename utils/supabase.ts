import { createClient } from '@supabase/supabase-js'
import {Database} from "@/database";

const supabaseUrl = 'https://akzhjllnroxfqeufcrjc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFremhqbGxucm94ZnFldWZjcmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwMjc1NTUsImV4cCI6MjAxNzYwMzU1NX0.t2orqSvo_7FcKBcX9zj5V6oo7A7cWyPZWrtcl72mXJ0';

export const client = createClient<Database>(supabaseUrl, supabaseKey)