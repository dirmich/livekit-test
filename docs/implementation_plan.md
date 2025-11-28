# 통합 방 관리 및 채팅 구현 계획

## 목표 설명
사용자가 활성화된 방 목록을 보고, 새로운 방을 만들거나 참여할 수 있는 통합 방 관리 시스템을 구현합니다. 방 내부 인터페이스는 기본적으로 텍스트 채팅을 보여주며, 사용자가 원할 때 오디오와 비디오를 켤 수 있도록 합니다.

## 사용자 검토 필요 사항
> [!IMPORTANT]
> 이 기능은 LiveKit Server SDK를 사용하여 활성 방 목록을 조회하는 서버 사이드 API를 추가합니다.

## 변경 제안

### 백엔드 (API 라우트)
#### [NEW] [src/app/api/rooms/route.ts](file:///Volumes/3TB-MAC/work/0.Project/0.highmaru/livekit-test/src/app/api/rooms/route.ts)
- `GET`: `RoomServiceClient.listRooms()`을 사용하여 활성 방 목록을 조회합니다.
- `POST`: 새로운 방을 생성합니다 (LiveKit은 참여 시 자동 생성되지만, 명시적 생성을 위해 유효성 검사 등을 추가할 수 있음).

#### [NEW] [src/lib/livekit/service.ts](file:///Volumes/3TB-MAC/work/0.Project/0.highmaru/livekit-test/src/lib/livekit/service.ts)
- API 키/시크릿으로 초기화된 `RoomServiceClient` 싱글톤 인스턴스를 내보냅니다.

### 프론트엔드 (UI)
#### [MODIFY] [src/app/page.tsx](file:///Volumes/3TB-MAC/work/0.Project/0.highmaru/livekit-test/src/app/page.tsx)
- 현재의 "Chat Test" / "Video Test" 카드를 다음으로 교체합니다:
    - **활성 방 목록**: `/api/rooms`에서 가져온 방 목록을 표시합니다.
    - **방 만들기**: 방 이름을 입력하고 "참여/생성"할 수 있는 입력 필드와 버튼을 추가합니다.

#### [NEW] [src/app/room/[roomName]/page.tsx](file:///Volumes/3TB-MAC/work/0.Project/0.highmaru/livekit-test/src/app/room/[roomName]/page.tsx)
- 통합된 방 인터페이스를 구현합니다.
- **기본 상태**: 텍스트 채팅만 보임. 오디오/비디오는 꺼짐 상태.
- **제어**: 마이크와 카메라를 켜고 끄는 토글 버튼 제공.
- **레이아웃**:
    - 사이드바/하단 패널: 채팅 영역.
    - 메인 영역: 비디오 그리드 (비디오가 켜진 경우에만 표시).

#### [MODIFY] [src/components/chat/Chat.tsx](file:///Volumes/3TB-MAC/work/0.Project/0.highmaru/livekit-test/src/components/chat/Chat.tsx)
- 통합된 방 레이아웃에 쉽게 임베드될 수 있도록 스타일을 조정합니다.

## 검증 계획

### 자동화 테스트
- `/api/rooms`가 JSON 목록을 반환하는지 확인합니다.

### 수동 검증
1. **방 목록**: 홈 화면에 초기에는 "활성 방 없음"이 표시되는지 확인합니다.
2. **방 생성**: "Lobby"라는 방 이름을 입력하고 참여합니다.
3. **방 내부**:
    - 텍스트 채팅이 작동하는지 확인합니다.
    - 마이크/카메라가 기본적으로 꺼져 있는지 확인합니다.
    - 마이크/카메라를 켜고 로컬 비디오 미리보기가 나타나는지 확인합니다.
4. **다중 사용자**: 새 브라우저 창/탭을 엽니다.
    - 홈 화면의 활성 방 목록에 "Lobby"가 나타나는지 확인합니다.
    - "Lobby"에 참여합니다.
    - 양방향 채팅 및 비디오가 작동하는지 확인합니다.
