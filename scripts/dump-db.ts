import { Client } from 'pg';
import fs from 'fs';
import { configDotenv } from 'dotenv';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
// import fetch from 'node-fetch';

// 1. Cấu hình environment
const env = configDotenv({ path: path.resolve(__dirname, "../.env.local") }).parsed;

if (!env) throw new Error("Environment variables not loaded");

// 2. Khởi tạo Supabase client
const supabase = createClient(
	env.SUPABASE_URL!,
	env.SUPABASE_KEY!
);

// 3. Cấu hình PostgreSQL client
const pgClient = new Client({
	connectionString: env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

// async function downloadBackup() {
// 	try {
// 		// 4. Lấy danh sách backups từ Supabase
// 		const { data: backups, error } = await supabase
// 			.storage
// 			.from('backups')
// 			.list();
//
// 		if (error) throw error;
//
// 		// 5. Lấy backup mới nhất
// 		const latestBackup = backups
// 			.filter(file => file.name.endsWith('.sql'))
// 			.sort((a, b) =>
// 				new Date(b.created_at).getTime() -
// 				new Date(a.created_at).getTime()
// 			)[0];
//
// 		if (!latestBackup) throw new Error('No backup found');
//
// 		// 6. Tải backup về
// 		const { data: { signedUrl } } = await supabase
// 			.storage
// 			.from('backups')
// 			.createSignedUrl(latestBackup.name, 60);
//
// 		const response = await fetch(signedUrl);
// 		const backupPath = path.resolve(__dirname, '../temp_backup.sql');
//
// 		// 7. Lưu file backup
// 		const writer = fs.createWriteStream(backupPath);
// 		response.body?.pipe(writer);
//
// 		return new Promise((resolve, reject) => {
// 			writer.on('finish', () => resolve("Downloaded"));
// 			writer.on('error', reject);
// 		});
//
// 	} catch (error) {
// 		console.error('❌ Backup download failed:', error);
// 		throw error;
// 	}
// }

async function restoreDatabase() {
	try {

		// 9. Kết nối database
		await pgClient.connect();
		console.log('✅ Connected to PostgreSQL');

		// 10. Đọc và thực thi file backup
		const backupPath = path.resolve(__dirname, '../postgres/backup.sql');
		const sql = fs.readFileSync(backupPath, 'utf8');

		// 11. Thực thi từng câu lệnh
		const commands = sql.split(/;\s*$/m);
		for (const cmd of commands) {
			if (cmd.trim()) {
				await pgClient.query(cmd);
			}
		}

		console.log('✅ Database restored successfully');

	} catch (error) {
		console.error('❌ Restore failed:', error);
	} finally {
		// 12. Dọn dẹp
		await pgClient.end();
		// fs.unlinkSync(path.resolve(__dirname, '../temp_backup.sql'));
		console.log('🔌 Connection closed');
	}
}

// 13. Chạy restore
restoreDatabase();