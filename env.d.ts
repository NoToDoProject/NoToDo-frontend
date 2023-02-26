/// <reference types="vite/client" />
declare interface Window {
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $loadbar: LoadingBarInst;
    $notify: NotificationApiInjection;
}
