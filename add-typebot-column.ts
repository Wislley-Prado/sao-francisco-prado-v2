import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
// We need to use the service role key to alter table, or maybe we can't do DDL over REST.
// Actually, supabase JS client does not support ALTER TABLE. DDL is not supported over PostgREST.
