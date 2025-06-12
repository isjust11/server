import { RoleEnum } from 'src/enums/role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { CategoryTypeEnum } from 'src/enums/category-type.enum';
import { CategoryCodeEnum } from 'src/enums/category-code.enum';
import { v4 as uuidv4 } from 'uuid';

export class SeedsCommonData1710669600002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert roles
        await queryRunner.query(`
            INSERT INTO role (id, name, code, description, isActive) VALUES
            ('${uuidv4()}', 'Quản trị viên', '${RoleEnum.ADMIN}', 'Quản trị viên hệ thống', true),
            ('${uuidv4()}', 'Quản lý', '${RoleEnum.MANAGER}', 'Quản lý nhà hàng', true),
            ('${uuidv4()}', 'Nhân viên', '${RoleEnum.STAFF}', 'Nhân viên phục vụ', true),
            ('${uuidv4()}', 'Đầu bếp', '${RoleEnum.CHEF}', 'Đầu bếp', true),
            ('${uuidv4()}', 'Khách hàng', '${RoleEnum.CUSTOMER}', 'Khách hàng', true),
            ('${uuidv4()}', 'Khách', '${RoleEnum.GUEST}', 'Khách không đăng nhập', true)
        `);

        // Insert category types
        await queryRunner.query(`
            INSERT INTO category_type (id, name, code, description, isActive) VALUES
            ('${uuidv4()}', 'Menu chức năng', '${CategoryTypeEnum.FEATURE_TYPE}', 'Danh mục các chức năng trong hệ thống', true),
            ('${uuidv4()}', 'Danh mục món ăn', '${CategoryTypeEnum.FOOD_CATEGORY}', 'Danh mục phân loại món ăn', true),
            ('${uuidv4()}', 'Loại món ăn', '${CategoryTypeEnum.FOOD_TYPE}', 'Phân loại món ăn theo loại', true),
            ('${uuidv4()}', 'Trạng thái món ăn', '${CategoryTypeEnum.FOOD_STATUS}', 'Trạng thái của món ăn', true),
            ('${uuidv4()}', 'Đơn vị món ăn', '${CategoryTypeEnum.FOOD_UNIT}', 'Đơn vị tính của món ăn', true),
            ('${uuidv4()}', 'Loại bàn', '${CategoryTypeEnum.TABLE_TYPE}', 'Phân loại bàn', true),
            ('${uuidv4()}', 'Trạng thái bàn', '${CategoryTypeEnum.TABLE_STATUS}', 'Trạng thái của bàn', true),
            ('${uuidv4()}', 'Khu vực bàn', '${CategoryTypeEnum.TABLE_AREA}', 'Khu vực đặt bàn', true)
        `);

        // Lấy category type ID cho FEATURE_TYPE
        const featureTypeResult = await queryRunner.query(`
            SELECT id FROM category_type WHERE code = '${CategoryTypeEnum.FEATURE_TYPE}'
        `);
        const featureTypeId = featureTypeResult[0].id;

        // Insert categories cho FEATURE_TYPE
        await queryRunner.query(`
            INSERT INTO category (id, name, code, description, categoryTypeId, isActive) VALUES
            ('${uuidv4()}', 'Menu', '${CategoryCodeEnum.FEATURE_MENU}', 'Menu chức năng chính', '${featureTypeId}', true),
            ('${uuidv4()}', 'Khác', '${CategoryCodeEnum.FEATURE_OTHERS}', 'Các chức năng khác', '${featureTypeId}', true)
        `);

        // Tạo dữ liệu cho chức năng quản trị
        const adminFeatureId = uuidv4();
        const adminRoleFeatureId = uuidv4();
        const adminFeatureChildId = uuidv4();

        // Insert chức năng quản trị
        await queryRunner.query(`
            INSERT INTO navigator (id, name, code, path, icon, parentId, order, isActive) VALUES
            ('${adminFeatureId}', 'Quản trị', 'ADMIN', '/admin', 'settings', null, 1, true)
        `);

        // Insert các chức năng con của quản trị
        await queryRunner.query(`
            INSERT INTO navigator (id, name, code, path, icon, parentId, order, isActive) VALUES
            ('${adminFeatureChildId}', 'Chức năng', 'ADMIN_FEATURE', '/manager/admin/features', 'list', '${adminFeatureId}', 1, true),
            ('${adminRoleFeatureId}', 'Vai trò', 'ADMIN_ROLE', '/manager/admin/roles', 'users', '${adminFeatureId}', 2, true)
        `);

        // Lấy role admin
        const adminRoleResult = await queryRunner.query(`
            SELECT id FROM role WHERE code = '${RoleEnum.ADMIN}'
        `);
        const adminRoleId = adminRoleResult[0].id;

        // Gán quyền cho role admin
        await queryRunner.query(`
            INSERT INTO role_navigator (roleId, navigatorId) VALUES
            ('${adminRoleId}', '${adminFeatureId}'),
            ('${adminRoleId}', '${adminFeatureChildId}'),
            ('${adminRoleId}', '${adminRoleFeatureId}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM role_navigator');
        await queryRunner.query('DELETE FROM navigator');
        await queryRunner.query('DELETE FROM category');
        await queryRunner.query('DELETE FROM category_type');
        await queryRunner.query('DELETE FROM role');
    }
} 