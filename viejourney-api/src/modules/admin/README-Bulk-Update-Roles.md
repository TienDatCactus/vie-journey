# Admin Bulk Update User Roles API

## Endpoint
**PATCH** `/admin/users/bulk-update-roles`

## Authentication
- Requires JWT token
- Requires ADMIN role

## Description
Admin API để cập nhật role cho nhiều user cùng lúc bằng cách truyền vào danh sách userID.

## Request Body
```json
{
  "userIds": ["64f7a8b2c1234567890abcde", "64f7a8b2c1234567890abcdf", "64f7a8b2c1234567890abce0"],
  "role": "MANAGER"
}
```

### Fields
- **userIds** (array, required): Mảng các userInfo ID (không phải account ID)
- **role** (string, required): Role mới - phải là một trong ['USER', 'ADMIN', 'MANAGER']

## Response
```json
{
  "success": [
    {
      "userId": "64f7a8b2c1234567890abcde",
      "accountId": "64f7a8b2c1234567890abce1",
      "email": "user1@example.com",
      "userName": "Nguyễn Văn A",
      "oldRole": "USER",
      "newRole": "MANAGER",
      "status": "ACTIVE"
    },
    {
      "userId": "64f7a8b2c1234567890abcdf",
      "accountId": "64f7a8b2c1234567890abce2",
      "email": "user2@example.com",
      "userName": "Trần Thị B",
      "oldRole": "USER",
      "newRole": "MANAGER",
      "status": "ACTIVE"
    }
  ],
  "failed": [
    {
      "userId": "64f7a8b2c1234567890abce0",
      "reason": "User not found"
    }
  ],
  "summary": {
    "totalRequested": 3,
    "successCount": 2,
    "failedCount": 1
  }
}
```

## Response Fields

### Success Array
- **userId**: ID của user trong UserInfos collection
- **accountId**: ID của account tương ứng
- **email**: Email của account
- **userName**: Tên đầy đủ của user
- **oldRole**: Role cũ trước khi update
- **newRole**: Role mới sau khi update
- **status**: Trạng thái hiện tại của account

### Failed Array
- **userId**: ID của user không thể update
- **reason**: Lý do không thể update

### Summary
- **totalRequested**: Tổng số user được yêu cầu update
- **successCount**: Số user update thành công
- **failedCount**: Số user update thất bại

## Validation Rules
1. **Role validation**: Role phải là một trong ['USER', 'ADMIN', 'MANAGER']
2. **UserIds validation**: Mảng userIds không được rỗng
3. **Admin protection**: Không thể đổi role ADMIN thành role khác (trừ ADMIN)
4. **User existence**: UserInfo và Account phải tồn tại

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid role. Must be one of: USER, ADMIN, MANAGER"
}
```

```json
{
  "statusCode": 400,
  "message": "At least one userId is required"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Usage Examples

### Promote users to MANAGER
```bash
curl -X PATCH http://localhost:3000/admin/users/bulk-update-roles \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["64f7a8b2c1234567890abcde", "64f7a8b2c1234567890abcdf"],
    "role": "MANAGER"
  }'
```

### Demote users to USER
```bash
curl -X PATCH http://localhost:3000/admin/users/bulk-update-roles \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["64f7a8b2c1234567890abcde"],
    "role": "USER"
  }'
```

## Notes
- API này sử dụng UserInfos ID (không phải Account ID)
- Để lấy UserInfos ID, sử dụng API `GET /admin/users`
- Thao tác này không thể hoàn tác (irreversible)
- Admin role được bảo vệ đặc biệt
- API trả về cả kết quả thành công và thất bại để admin có thể xem chi tiết
