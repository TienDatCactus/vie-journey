# Blog API Documentation - User Workflow

## User Blog Creation Workflow

### 1. Start Writing a Blog
**Endpoint**: `POST /blogs/start-blog`  
**Authentication**: Required (JWT)  
**Description**: User nhập địa điểm và tạo blog draft với title tự động

**Request Body**:
```json
{
  "location": "Đà Nẵng"
}
```

**Response**:
```json
{
  "blogId": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide",
  "location": "Đà Nẵng",
  "status": "DRAFT",
  "message": "Blog draft created successfully. You can now start writing."
}
```

### 2. Get Draft Blog for Editing
**Endpoint**: `GET /blogs/draft/:id`  
**Authentication**: Required (JWT)  
**Description**: Lấy thông tin blog draft để tiến hành viết

**Response**:
```json
{
  "_id": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide",
  "content": "",
  "summary": "",
  "tags": [],
  "coverImage": "",
  "location": "Đà Nẵng",
  "status": "DRAFT",
  "createdAt": "2023-09-06T10:30:00.000Z",
  "updatedAt": "2023-09-06T10:30:00.000Z"
}
```

### 3. Update Draft Blog
**Endpoint**: `PATCH /blogs/draft/:id`  
**Authentication**: Required (JWT)  
**Description**: Cập nhật nội dung blog draft

**Request Body** (tất cả fields đều optional):
```json
{
  "title": "Đà Nẵng Guide - Updated",
  "content": "Đà Nẵng là một thành phố...",
  "summary": "Hướng dẫn du lịch Đà Nẵng chi tiết",
  "tags": ["du lịch", "Đà Nẵng", "Việt Nam"],
  "coverImage": "https://cloudinary.com/image.jpg"
}
```

**Response**:
```json
{
  "_id": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide - Updated",
  "content": "Đà Nẵng là một thành phố...",
  "summary": "Hướng dẫn du lịch Đà Nẵng chi tiết",
  "tags": ["du lịch", "Đà Nẵng", "Việt Nam"],
  "coverImage": "https://cloudinary.com/image.jpg",
  "location": "Đà Nẵng",
  "status": "DRAFT",
  "updatedAt": "2023-09-06T11:30:00.000Z",
  "message": "Blog draft updated successfully"
}
```

### 4. Publish Blog
**Endpoint**: `POST /blogs/publish/:id`  
**Authentication**: Required (JWT)  
**Description**: Publish blog (chuyển từ DRAFT sang PENDING để admin duyệt)

**Response**:
```json
{
  "blogId": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide",
  "status": "PENDING",
  "publishedAt": "2023-09-06T12:00:00.000Z",
  "message": "Blog published successfully and is now pending admin approval"
}
```

### 5. Get User's Blogs
**Endpoint**: `GET /blogs/my-blogs`  
**Authentication**: Required (JWT)  
**Description**: Lấy tất cả blog của user (có thể filter theo status)

**Optional Request Body**:
```json
{
  "status": "DRAFT"  // DRAFT, PENDING, APPROVED, REJECTED
}
```

**Response**:
```json
{
  "blogs": [
    {
      "_id": "64f7a8b2c1234567890abcde",
      "title": "Đà Nẵng Guide",
      "summary": "Hướng dẫn du lịch Đà Nẵng chi tiết",
      "coverImage": "https://cloudinary.com/image.jpg",
      "location": "Đà Nẵng",
      "status": "DRAFT",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T11:30:00.000Z",
      "metrics": {
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0
      }
    }
  ],
  "total": 1
}
```

## Blog Status Flow
1. **DRAFT**: Blog mới tạo, user có thể chỉnh sửa
2. **PENDING**: Blog đã publish, chờ admin duyệt
3. **APPROVED**: Admin đã duyệt, blog được hiển thị công khai
4. **REJECTED**: Admin từ chối, blog không được hiển thị

## Error Handling
Tất cả API đều có error handling với các mã lỗi phù hợp:
- `400`: Bad Request (thiếu dữ liệu hoặc dữ liệu không hợp lệ)
- `401`: Unauthorized (chưa đăng nhập)
- `404`: Not Found (không tìm thấy blog hoặc user)

## Validation Rules
- **Location**: Required, max 100 characters
- **Title**: 5-100 characters (auto-generated from location)
- **Content**: 0-50,000 characters (min 20 for publishing)
- **Summary**: max 300 characters
- **Tags**: max 10 tags
- **Cover Image**: max 500 characters URL
