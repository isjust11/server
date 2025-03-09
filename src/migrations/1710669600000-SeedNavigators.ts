import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedNavigators1710669600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add root level menus
        await queryRunner.query(`
            INSERT INTO navigator (icon, label, link) VALUES
            ('home', 'Dashboard', '/dashboard'),
            ('settings', 'Quản lý', '/manager'),
            ('list', 'Danh mục', '/categories');
        `);

        // Get the IDs of the root menus
        const rows = await queryRunner.query(
            'SELECT id, label FROM navigator WHERE parentId IS NULL'
        );
        
        // rows là một mảng các object, không cần [rows]
        const managementMenu = rows.find((row: any) => row.label === 'Quản lý');
        const categoryMenu = rows.find((row: any) => row.label === 'Danh mục');

        if (!managementMenu || !categoryMenu) {
            throw new Error('Could not find required menu items');
        }

        // Add management submenus
        await queryRunner.query(`
            INSERT INTO navigator (icon, label, link, parentId) VALUES
            ('users', 'Quản lý người dùng', '/users', ${managementMenu.id}),
            ('settings', 'Cài đặt hệ thống', '/settings', ${managementMenu.id});
        `);

        // Add category management submenus
        await queryRunner.query(`
            INSERT INTO navigator (icon, label, link, parentId) VALUES
            ('plus-circle', 'Thêm mới', '/categories/create', ${categoryMenu.id}),
            ('list', 'Danh sách', '/categories', ${categoryMenu.id}),
            ('edit', 'Chỉnh sửa', '/categories/edit', ${categoryMenu.id}),
            ('trash', 'Thùng rác', '/categories/trash', ${categoryMenu.id});
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM navigator');
    }
} 