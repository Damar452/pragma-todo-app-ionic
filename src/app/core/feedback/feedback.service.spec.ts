import { TestBed } from '@angular/core/testing';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

import { FeedbackRole, ItemAction } from './feedback.enums';
import { FeedbackService } from './feedback.service';

interface FakeOverlay {
  options: Record<string, unknown>;
  presented: boolean;
  dismissed: boolean;
  present(): Promise<void>;
  dismiss(): Promise<boolean>;
  onDidDismiss(): Promise<{ role?: string; data?: unknown }>;
}

/** Stands in for Ionic's overlay controllers; `dismissWith` scripts how the user closes the overlay. */
class FakeOverlayController {
  readonly created: FakeOverlay[] = [];
  dismissWith: string | undefined;
  dataWith: unknown;

  create(options: Record<string, unknown>): Promise<FakeOverlay> {
    const overlay: FakeOverlay = {
      options,
      presented: false,
      dismissed: false,
      present: () => {
        overlay.presented = true;
        return Promise.resolve();
      },
      dismiss: () => {
        overlay.dismissed = true;
        return Promise.resolve(true);
      },
      onDidDismiss: () => Promise.resolve({ role: this.dismissWith, data: this.dataWith }),
    };
    this.created.push(overlay);
    return Promise.resolve(overlay);
  }
}

function setup() {
  const toasts = new FakeOverlayController();
  const alerts = new FakeOverlayController();
  const sheets = new FakeOverlayController();
  TestBed.configureTestingModule({
    providers: [
      { provide: ToastController, useValue: toasts },
      { provide: AlertController, useValue: alerts },
      { provide: ActionSheetController, useValue: sheets },
    ],
  });
  return { toasts, alerts, sheets, service: TestBed.inject(FeedbackService) };
}

describe('FeedbackService', () => {
  describe('toast', () => {
    it('shows the translated message', async () => {
      // Arrange
      const { service, toasts } = setup();

      // Act
      await service.toast('tasks.feedback.created');

      // Assert
      expect(toasts.created[0].options['message']).toBe('Tarea creada');
      expect(toasts.created[0].presented).toBe(true);
    });

    it('interpolates params', async () => {
      // Arrange
      const { service, toasts } = setup();

      // Act
      await service.toast('categories.feedback.deleted', { name: 'Casa' });

      // Assert
      expect(toasts.created[0].options['message']).toBe('Categoría «Casa» eliminada');
    });

    it('replaces the toast that is still visible', async () => {
      // Arrange
      const { service, toasts } = setup();

      // Act
      await service.toast('tasks.feedback.created');
      await service.toast('tasks.feedback.updated');

      // Assert
      expect(toasts.created[0].dismissed).toBe(true);
    });
  });

  describe('toastError', () => {
    it('uses the danger color', async () => {
      // Arrange
      const { service, toasts } = setup();

      // Act
      await service.toastError('feedback.error');

      // Assert
      expect(toasts.created[0].options['color']).toBe('danger');
    });
  });

  describe('toastWithUndo', () => {
    it('resolves true when the user taps "Deshacer"', async () => {
      // Arrange
      const { service, toasts } = setup();
      toasts.dismissWith = FeedbackRole.Undo;

      // Act
      const undone = await service.toastWithUndo('tasks.feedback.deleted');

      // Assert
      expect(undone).toBe(true);
      expect(toasts.created[0].options['buttons']).toEqual([
        { text: 'Deshacer', role: FeedbackRole.Undo },
      ]);
    });

    it('resolves false when the toast times out', async () => {
      // Arrange
      const { service, toasts } = setup();
      toasts.dismissWith = 'timeout';

      // Act
      const undone = await service.toastWithUndo('tasks.feedback.deleted');

      // Assert
      expect(undone).toBe(false);
    });
  });

  describe('confirm', () => {
    const options = {
      headerKey: 'categories.confirmDelete.header',
      messageKey: 'categories.confirmDelete.message',
      params: { name: 'Casa', count: 2 },
      confirmKey: 'categories.confirmDelete.confirm',
      cancelKey: 'categories.confirmDelete.cancel',
      destructive: true,
    };

    it('resolves true when the confirm button is pressed', async () => {
      // Arrange
      const { service, alerts } = setup();
      alerts.dismissWith = FeedbackRole.Destructive;

      // Act
      const confirmed = await service.confirm(options);

      // Assert
      expect(confirmed).toBe(true);
    });

    it('resolves false when cancelled', async () => {
      // Arrange
      const { service, alerts } = setup();
      alerts.dismissWith = FeedbackRole.Cancel;

      // Act
      const confirmed = await service.confirm(options);

      // Assert
      expect(confirmed).toBe(false);
    });

    it('resolves false when dismissed by tapping the backdrop', async () => {
      // Arrange
      const { service, alerts } = setup();
      alerts.dismissWith = 'backdrop';

      // Act
      const confirmed = await service.confirm(options);

      // Assert
      expect(confirmed).toBe(false);
    });

    it('translates header and message and marks the confirm button destructive', async () => {
      // Arrange
      const { service, alerts } = setup();

      // Act
      await service.confirm(options);

      // Assert
      const created = alerts.created[0].options;
      expect(created['header']).toBe('¿Eliminar «Casa»?');
      expect(created['message']).toBe('Sus 2 tareas quedarán sin categoría.');
      expect(created['buttons']).toEqual([
        { text: 'Cancelar', role: FeedbackRole.Cancel },
        { text: 'Eliminar', role: FeedbackRole.Destructive },
      ]);
    });

    it('uses a plain confirm role when not destructive', async () => {
      // Arrange
      const { service, alerts } = setup();
      alerts.dismissWith = FeedbackRole.Confirm;

      // Act
      const confirmed = await service.confirm({ ...options, destructive: false });

      // Assert
      expect(confirmed).toBe(true);
    });
  });

  describe('chooseItemAction', () => {
    it('resolves the action of the tapped button', async () => {
      // Arrange
      const { service, sheets } = setup();
      sheets.dataWith = ItemAction.Delete;

      // Act
      const action = await service.chooseItemAction({ header: 'Buy milk' });

      // Assert
      expect(action).toBe(ItemAction.Delete);
    });

    it('resolves null when cancelled', async () => {
      // Arrange
      const { service, sheets } = setup();
      sheets.dismissWith = FeedbackRole.Cancel;

      // Act
      const action = await service.chooseItemAction({ header: 'Buy milk' });

      // Assert
      expect(action).toBeNull();
    });

    it('resolves null when dismissed by tapping the backdrop', async () => {
      // Arrange
      const { service, sheets } = setup();
      sheets.dismissWith = 'backdrop';

      // Act
      const action = await service.chooseItemAction({ header: 'Buy milk' });

      // Assert
      expect(action).toBeNull();
    });

    it('shows the item as header with edit, delete (destructive) and cancel buttons', async () => {
      // Arrange
      const { service, sheets } = setup();

      // Act
      await service.chooseItemAction({ header: 'Buy milk' });

      // Assert
      const created = sheets.created[0];
      expect(created.presented).toBe(true);
      expect(created.options['header']).toBe('Buy milk');
      expect(created.options['buttons']).toEqual([
        { text: 'Editar', icon: 'create-outline', role: undefined, data: ItemAction.Edit },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: FeedbackRole.Destructive,
          data: ItemAction.Delete,
        },
        { text: 'Cancelar', role: FeedbackRole.Cancel },
      ]);
    });
  });
});
