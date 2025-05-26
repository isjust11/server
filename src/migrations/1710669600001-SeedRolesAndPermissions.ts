import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesAndPermissions1710669600001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert permissions
        await queryRunner.query(`
            INSERT INTO permission (name, code, description, isActive) VALUES
            ('Xem dashboard', 'VIEW_DASHBOARD', 'Quyền xem trang dashboard', true),
            ('Quản lý người dùng', 'MANAGE_USERS', 'Quyền quản lý người dùng', true),
            ('Quản lý đơn hàng', 'MANAGE_ORDERS', 'Quyền quản lý đơn hàng', true),
            ('Quản lý món ăn', 'MANAGE_FOOD', 'Quyền quản lý món ăn', true),
            ('Quản lý bàn', 'MANAGE_TABLES', 'Quyền quản lý bàn', true),
            ('Xem báo cáo', 'VIEW_REPORTS', 'Quyền xem báo cáo', true),
            ('Quản lý cài đặt', 'MANAGE_SETTINGS', 'Quyền quản lý cài đặt hệ thống', true)
        `);

        // Insert roles
        await queryRunner.query(`
            INSERT INTO role (name, code, description, isActive) VALUES
            ('Quản trị viên', 'ADMIN', 'Quản trị viên hệ thống', true),
            ('Quản lý', 'MANAGER', 'Quản lý nhà hàng', true),
            ('Nhân viên', 'STAFF', 'Nhân viên phục vụ', true),
            ('Đầu bếp', 'CHEF', 'Đầu bếp', true),
            ('Khách hàng', 'USER', 'Khách hàng', true),
            ('Khách', 'GUEST', 'Khách không đăng nhập', true)
        `);

        // Get all permissions
        const permissions = await queryRunner.query('SELECT id, code FROM permission');
        
        // Get all roles
        const roles = await queryRunner.query('SELECT id, code FROM role');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM role_permissions');
        await queryRunner.query('DELETE FROM role');
        await queryRunner.query('DELETE FROM permission');
    }
} 