import { driver } from 'driver.js';

const homeTutorialConfig = {
  showProgress: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#home-header',
      popover: {
        title: 'Trang chủ',
        description: 'Nhấn vào đây để quay lại trang chủ/Trang chính',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#match-header',
      popover: {
        title: 'Trận đấu',
        description: 'Nhấn vào đây để có thể tạo hoặc tham gia trận đấu',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#config-header',
      popover: {
        title: 'Cài đặt',
        description:
          'Nhấn vào đây để cài đặt điểm số của các nhân vật, nón ánh sáng,...',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#language-selector',
      popover: {
        title: 'Ngôn ngữ',
        description: 'Nhấn vào đây để thay đổi ngôn ngữ',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#login-button',
      popover: {
        title: 'Đăng nhập',
        description: 'Khi bạn cần đăng nhập thì nhấn vào đây',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#home-content',
      popover: {
        title: 'Hướng dẫn',
        description: 'Hiển thị danh sách các trận đấu',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#create-tournament',
      popover: {
        title: 'Tạo giải đấu',
        description:
          'Nhấn vào đây để tạo trận đấu mới. Lưu ý chỉ khi bạn đăng nhập mới có thể tạo trận đấu',
        side: 'right',
        align: 'start',
      },
    },
  ],
};

const tournamentTutorialConfig = {
  showProgress: true,
  smoothScroll: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#setup-bracket',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Nếu bạn là người tạo trận đấu, hãy thiết lập bảng đấu tại đây. Lưu ý chỉ có người tạo trận đấu mới có quyền thiết lập bảng đấu',
        side: 'right',
        align: 'start',
      },
    },
  ],
};

const bracketTutorialConfig = {
  showProgress: true,
  smoothScroll: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#bracket-view',
      popover: {
        title: 'Hướng dẫn',
        description: 'Đây là nơi hiển thị bảng đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#bracket-config',
      popover: {
        title: 'Hướng dẫn',
        description: 'Đây là nơi để cấu hình bảng đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#elimation-type',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Chọn loại bảng đấu. Hiện tại chỉ hỗ trợ tạo kiểu loại trực tiếp. Mình đang phát triển thêm các loại khác',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#add-player',
      popover: {
        title: 'Hướng dẫn',
        description: 'Nhấn vào đây để thêm người chơi vào bảng đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#save-bracket',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Lưu ý khi bạn đã cấu hình xong bảng đấu, hãy nhấn vào đây để lưu lại',
        side: 'right',
        align: 'start',
      },
    },
  ],
};

const matchTutorialCofig = {
  showProgress: true,
  smoothScroll: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#match-create',
      popover: {
        title: 'Hướng dẫn',
        description: 'Nhấn vào đây để tạo trận đấu',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#match-join',
      popover: {
        title: 'Tạo trận đấu',
        description: 'Nhấn vào đây để tham gia trận đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-editor',
      popover: {
        title: 'Hướng dẫn',
        description: 'Đây là giao diện để tạo trận đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-details',
      popover: {
        title: 'Hướng dẫn',
        description: 'Cấu hình chi tiết trận đấu tại đây',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-players',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Bạn có thể sắp xếp lại thứ tự người chơi bằng cách kéo thả',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#match-save',
      popover: {
        title: 'Hướng dẫn',
        description: 'Xong thì nhấn vào đây để bắt đầu nhé!!!',
        side: 'right',
        align: 'start',
      },
    },
  ],
};

const matchViewerTutorialConfig = {
  showProgress: true,
  smoothScroll: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#match-live',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Người xem sẽ được trực tiếp theo dõi cấm chọn của các đội',
        side: 'over',
        align: 'start',
      },
    },
    {
      element: '#match-get-url > span',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Nhấn vào đây để lấy link mời người xem. Lưu ý hiện tại mình vẫn chưa phân quyền nên mọi người đều có thể lấy link của của player',
        side: 'bottom',
        align: 'start',
      },
    },
  ],
};

const matchLiveSteamTutorialConfig = {
  showProgress: true,
  smoothScroll: true,
  disableActiveInteraction: true,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#match-live-details',
      popover: {
        title: 'Hướng dẫn',
        description: 'Thông tin trận đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-live-url',
      popover: {
        title: 'Hướng dẫn',
        description: 'Nhấn vào đây để lấy link trực tiếp trận đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-games',
      popover: {
        title: 'Hướng dẫn',
        description: 'Danh sách các trận đấu',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#match-live-stream',
      popover: {
        title: 'Hướng dẫn',
        description:
          'Đây là nơi trực tiếp trận đấu. Nếu bạn là người chơi và tới lượt của bạn, hãy chiếu trực tiếp trận đấu tại đây. Ngược lại, nếu bạn là người xem và khi có trực tiếp hãy nhấn vào button xem trực tiếp',
        side: 'right',
        align: 'start',
      },
    },
  ],
};

type TutorialConfig =
  | 'home'
  | 'tournament'
  | 'bracket'
  | 'match'
  | 'match-viewer'
  | 'match-live-stream';

export const startTutorial = (tutorialConfig: TutorialConfig) => {
  switch (tutorialConfig) {
    case 'home':
      return driver(homeTutorialConfig as any);
    case 'tournament':
      return driver(tournamentTutorialConfig as any);
    case 'bracket':
      return driver(bracketTutorialConfig as any);
    case 'match':
      return driver(matchTutorialCofig as any);
    case 'match-viewer':
      return driver(matchViewerTutorialConfig as any);
    case 'match-live-stream':
      return driver(matchLiveSteamTutorialConfig as any);
    default:
      return null;
  }
};
