# GitHub Actions → S3 · CloudFront 배포 설정

`master` 브랜치에 변경사항이 푸시되면 GitHub Actions가 프론트엔드를 빌드하고 `dist/` 결과물을 `s3://mvpilot.cloud`에 동기화합니다. CloudFront가 이 버킷을 원본으로 사용하며, 업로드 후 기존 캐시를 항상 무효화합니다. AWS 인증은 장기 액세스 키 대신 GitHub OIDC와 IAM Role을 사용합니다.

## 1. S3와 CloudFront 구성 확인

S3 정적 웹 사이트 호스팅이나 퍼블릭 읽기 권한은 필요하지 않습니다. CloudFront 원본은 `mvpilot.cloud` 버킷의 S3 REST 엔드포인트를 사용하고, 가능하면 Origin Access Control(OAC)로만 읽도록 구성합니다.

React Router 경로로 직접 접속할 수 있도록 CloudFront에는 아래 항목이 필요합니다.

- 기본 루트 객체: `index.html`
- 사용자 지정 오류 응답: `403`, `404`를 `/index.html`, 응답 코드 `200`으로 변환
- 뷰어 프로토콜 정책: HTTP를 HTTPS로 리디렉션
- 압축: 활성화
- 캐시 정책: AWS 관리형 `CachingDisabled` 또는 Default TTL, Minimum TTL, Maximum TTL을 모두 `0`으로 설정

워크플로는 모든 S3 객체에 `Cache-Control: no-store, no-cache, max-age=0, must-revalidate`를 지정합니다. CloudFront에서도 캐시 정책을 비활성화해야 데모 변경사항이 항상 즉시 반영됩니다. 워크플로는 기존 CloudFront 배포 설정을 임의로 변경하지 않으며, 배포 결과 업로드와 전체 경로 캐시 무효화만 담당합니다.

## 2. GitHub OIDC IAM Role 준비

AWS IAM에 GitHub OIDC 공급자를 등록합니다.

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

IAM Role의 신뢰 정책은 이 저장소의 `master` 브랜치에서만 역할을 맡을 수 있도록 제한합니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:UNITHON-modakbul/modakbul_frontend:ref:refs/heads/master"
        }
      }
    }
  ]
}
```

Role 권한은 배포 대상 버킷과 CloudFront 캐시 무효화로 제한합니다. 아래 CloudFront ARN의 계정 ID와 배포 ID는 실제 값으로 교체합니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListDeploymentBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mvpilot.cloud"
    },
    {
      "Sid": "DeployWebsiteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::mvpilot.cloud/*"
    },
    {
      "Sid": "InvalidateCloudFrontCache",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::YOUR_AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

## 3. GitHub Environment 변수 설정

GitHub 저장소의 `Settings → Environments → production`에 아래 변수를 등록합니다.

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `AWS_REGION` | 필수 | S3 버킷 리전 |
| `AWS_ROLE_ARN` | 필수 | GitHub OIDC가 맡을 IAM Role ARN |
| `CLOUDFRONT_DISTRIBUTION_ID` | 필수 | 업로드 후 캐시를 무효화할 CloudFront 배포 ID |
| `SITE_URL` | 선택 | Actions 실행 결과에 표시할 웹 사이트 URL |
| `VITE_API_BASE_URL` | 선택 | 프로덕션 API 기본 주소 |
| `VITE_SERVICE_PREVIEW_URL` | 선택 | 프로덕션 서비스 미리보기 주소 |

배포 버킷은 요청된 `mvpilot.cloud`로 워크플로에 고정되어 있습니다. CloudFront 배포 ID가 없으면 캐시 없는 배포를 보장할 수 없으므로 워크플로가 설정 검증 단계에서 중단됩니다.

## 4. 배포 실행

- `master` 브랜치에 푸시하면 자동 실행됩니다.
- GitHub의 `Actions → Deploy frontend to S3 → Run workflow`에서 수동 실행할 수도 있습니다.
- 동일한 배포가 겹치면 이전 실행을 취소하고 최신 커밋만 배포합니다.

HTML, JavaScript, CSS, 이미지 등 모든 결과물에 캐시 금지 헤더를 적용합니다. S3에는 `dist/`와 동일하지 않은 이전 파일을 자동으로 삭제하며, 배포 직후 CloudFront `/*` 무효화를 항상 요청합니다.
