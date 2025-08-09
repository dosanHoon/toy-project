# image-uploader2 (react-hook-form)

react-hook-form 기반 이미지 업로더 예제입니다. 다중 업로드, 드래그앤드랍, 정렬, 대표 이미지 지정, 실패/재시도, 진행률/스피너, 토스트 요약, displayOrder 저장을 포함합니다.

## 실행

```bash
npm i
npm run dev
```

## 주요 기능

- 드래그앤드랍 / 파일 선택 업로드 (다중)
- 업로드 중 슬롯 스피너 + 진행률 표시, 성공 시 즉시 썸네일 전환, 30% 실패 확률(목업)
- 썸네일 드래그 정렬(dnd-kit), 순서 변경 시 `displayOrder` 재계산 저장
- 대표 이미지: 썸네일 클릭으로 지정, 대표 삭제 시 자동 승계
- 실패 재시도 버튼, 업로드 완료 후 성공/실패 개수 토스트 표시

## 구조

- `src/components/RhfImageUploader.tsx`: RHF로 폼 상태 관리, 업로드/정렬/대표/재시도 오케스트레이션
- `src/components/uploader/types.ts`: 도메인 타입(`FormImage`, `UploaderForm`, `displayOrder` 포함)
- `src/components/uploader/SortableTile.tsx`: 단일 썸네일(드래그 가능, 스피너/진행바/배지/삭제)
- `src/components/uploader/styles.ts`: styled-components 모음(`Wrapper`, `DropArea`, `Grid`, `Tile`, `Media` 등)
- `src/services/mockUpload.ts`: 3초 지연, 30% 실패 확률, 진행률 콜백 지원 목업 API

## RHF와 상태 사용 원칙

- 배열 구조/정렬/삭제 인덱스: `fields` 기준 (RHF가 부여한 안정 키)
- 값 표시/업데이트: `watch('images')`로 읽고 `setValue`로 갱신 (progress/status/isPrimary/displayOrder)
- 정렬 후 순서값: `fields` 변경을 기준으로 `displayOrder = index` 재계산

## 서버 전송 팁

- 미리 업로드(권장): 업로더에서 URL 확보 후 RHF에는 `[ { url, displayOrder, isPrimary } ]`만 저장
- 제출 직전 합성: 굳이 저장하지 않을 경우 `images.map((img, i) => ({ ...img, displayOrder: i }))`

## 관련 프로젝트

- `../이미지업로더`: 로컬 상태 기반 업로더(동일 UX, React state 관리 버전)
