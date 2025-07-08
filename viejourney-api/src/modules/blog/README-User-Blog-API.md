# Blog API Documentation - User Workflow

## User Blog Creation Workflow

### 1. Start Writing a Blog
**Endpoint**: `POST /blogs/start-blog`  
**Authentication**: Required (JWT)  
**Description**: User nhập địa điểm và tạo blog draft với title tự động  
**Content-Type**: `multipart/form-data`

**Request Body**:
```json
{
  "location": "Đà Nẵng"
}
```

**Optional File Upload**:
- Field name: `coverImage`
- Supported formats: jpg, jpeg, png, gif, webp, avif
- Max size: 5MB

**Response**:
```json
{
  "blogId": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide",
  "location": "Đà Nẵng",
  "coverImage": "https://cloudinary.com/image.jpg",
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
  "coverImage": "https://cloudinary.com/image.jpg",
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
**Content-Type**: `multipart/form-data`

**Request Body** (tất cả fields đều optional):
```json
{
  "title": "Đà Nẵng Guide - Updated",
  "content": "Đà Nẵng là một thành phố...",
  "summary": "Hướng dẫn du lịch Đà Nẵng chi tiết",
  "tags": ["du lịch", "Đà Nẵng", "Việt Nam"]
}
```

**Optional File Upload**:
- Field name: `coverImage`
- Supported formats: jpg, jpeg, png, gif, webp, avif
- Max size: 5MB
- Note: Uploading new cover image will replace the existing one

**Response**:
```json
{
  "_id": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide - Updated",
  "content": "Đà Nẵng là một thành phố...",
  "summary": "Hướng dẫn du lịch Đà Nẵng chi tiết",
  "tags": ["du lịch", "Đà Nẵng", "Việt Nam"],
  "coverImage": "https://cloudinary.com/new-image.jpg",
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

### 6. Edit Published Blog
**Endpoint**: `PATCH /blogs/edit/:id`  
**Authentication**: Required (JWT)  
**Description**: Edit blog đã publish và đưa về trạng thái DRAFT để review lại  
**Content-Type**: `multipart/form-data`

**Request Body** (tất cả fields đều optional):
```json
{
  "title": "Đà Nẵng Guide - Updated Version",
  "content": "Nội dung cập nhật...",
  "summary": "Tóm tắt mới",
  "tags": ["du lịch", "cập nhật", "Đà Nẵng"]
}
```

**Optional File Upload**:
- Field name: `coverImage`
- Supported formats: jpg, jpeg, png, gif, webp, avif
- Max size: 5MB
- Note: Uploading new cover image will replace the existing one

**Response**:
```json
{
  "_id": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide - Updated Version",
  "content": "Nội dung cập nhật...",
  "summary": "Tóm tắt mới",
  "tags": ["du lịch", "cập nhật", "Đà Nẵng"],
  "coverImage": "https://cloudinary.com/updated-image.jpg",
  "location": "Đà Nẵng",
  "status": "DRAFT",
  "updatedAt": "2023-09-06T13:30:00.000Z",
  "message": "Blog has been edited and converted back to DRAFT status. You can publish it again after review."
}
```

### 7. Get Published Blog for Viewing/Editing
**Endpoint**: `GET /blogs/published/:id`  
**Authentication**: Required (JWT)  
**Description**: Lấy thông tin blog đã publish (PENDING/APPROVED/REJECTED) để xem hoặc chuẩn bị edit

**Response**:
```json
{
  "_id": "64f7a8b2c1234567890abcde",
  "title": "Đà Nẵng Guide",
  "content": "Nội dung chi tiết về Đà Nẵng...",
  "summary": "Hướng dẫn du lịch Đà Nẵng",
  "tags": ["du lịch", "Đà Nẵng", "hướng dẫn"],
  "coverImage": "https://cloudinary.com/image.jpg",
  "location": "Đà Nẵng",
  "status": "APPROVED",
  "metrics": {
    "viewCount": 150,
    "likeCount": 25,
    "commentCount": 8
  },
  "createdAt": "2023-09-06T10:30:00.000Z",
  "updatedAt": "2023-09-06T11:30:00.000Z",
  "message": "Blog is currently APPROVED. You can edit this blog if needed."
}
```

**Error Responses**:
```json
// Blog not found or not published
{
  "statusCode": 404,
  "message": "Published blog not found or you do not have permission to view this blog"
}

// User not found
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 8. Get All Approved Blogs for Home Page
**Endpoint**: `GET /blogs/home`  
**Authentication**: Not required (Public access)  
**Description**: Lấy tất cả blog đã được approved để hiển thị ở trang home

**Query Parameters** (all optional):
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, min: 1, max: 50)
- `search`: Search term (tìm kiếm trong title, summary, tags, location)

**Example Requests**:
```http
# Get first page with default settings
GET /blogs/home

# Get page 2 with 20 items per page
GET /blogs/home?page=2&limit=20

# Search for blogs about "Đà Nẵng"
GET /blogs/home?search=Đà Nẵng

# Combined: search + pagination
GET /blogs/home?search=du lịch&page=1&limit=15
```

**Response**:
```json
{
  "status": "success",
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "64f7a8b2c1234567890abcde",
        "title": "Đà Nẵng Guide - Hướng dẫn du lịch chi tiết",
        "summary": "Khám phá những địa điểm tuyệt vời tại Đà Nẵng",
        "coverImage": "https://cloudinary.com/image.jpg",
        "location": "Đà Nẵng",
        "tags": ["du lịch", "Đà Nẵng", "hướng dẫn"],
        "author": {
          "name": "Nguyễn Văn A",
          "email": "nguyenvana@example.com"
        },
        "metrics": {
          "viewCount": 150,
          "likeCount": 25,
          "commentCount": 8
        },
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T11:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses**:
```json
// Invalid pagination parameters
{
  "statusCode": 400,
  "message": "Invalid pagination parameters. Page must be >= 1, limit must be 1-50"
}

// No blogs found
{
  "status": "success",
  "message": "No approved blogs found",
  "data": {
    "blogs": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 0,
      "totalItems": 0,
      "itemsPerPage": 10,
      "hasNext": false,
      "hasPrev": false
    }
  }
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
