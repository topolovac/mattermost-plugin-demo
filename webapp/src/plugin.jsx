import React from 'react';

import {FormattedMessage} from 'react-intl';

import en from 'i18n/en.json';

import es from 'i18n/es.json';

import {id as pluginId} from './manifest';

import Root from './components/root';
import BottomTeamSidebar from './components/bottom_team_sidebar';
import LeftSidebarHeader from './components/left_sidebar_header';
import LinkTooltip from './components/link_tooltip';
import UserAttributes from './components/user_attributes';
import UserActions from './components/user_actions';
import RHSView from './components/right_hand_sidebar';
import SecretMessageSetting from './components/admin_settings/secret_message_setting';
import CustomSetting from './components/admin_settings/custom_setting';
import FilePreviewOverride from './components/file_preview_override';
import RouterShowcase from './components/router_showcase/router_showcase';
import PostType from './components/post_type';
import EphemeralPostType from './components/ephemeral_post_type';
import {
    MainMenuMobileIcon,
    ChannelHeaderButtonIcon,
    FileUploadMethodIcon,
} from './components/icons';
import {
    mainMenuAction,
    fileDropdownMenuAction,
    fileUploadMethodAction,
    postDropdownMenuAction,
    postDropdownSubMenuAction,
    channelHeaderMenuAction,
    websocketStatusChange,
    getStatus,
} from './actions';
import reducer from './reducer';

function getTranslations(locale) {
    switch (locale) {
    case 'en':
        return en;
    case 'es':
        return es;
    }
    return {};
}

export default class DemoPlugin {
    initialize(registry, store) {
        registry.registerRootComponent(Root);
        registry.registerPopoverUserAttributesComponent(UserAttributes);
        registry.registerPopoverUserActionsComponent(UserActions);
        registry.registerLeftSidebarHeaderComponent(LeftSidebarHeader);
        registry.registerLinkTooltipComponent(LinkTooltip);
        registry.registerBottomTeamSidebarComponent(
            BottomTeamSidebar,
        );
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(
            RHSView,
            <FormattedMessage
                id='plugin.name'
                defaultMessage='Demo Plugin'
            />);

        registry.registerChannelHeaderButtonAction(
            <ChannelHeaderButtonIcon/>,
            () => store.dispatch(toggleRHSPlugin),
            <FormattedMessage
                id='plugin.name'
                defaultMessage='Demo Plugin'
            />,
        );

        registry.registerPostTypeComponent('custom_demo_plugin', PostType);
        registry.registerPostTypeComponent('custom_demo_plugin_ephemeral', EphemeralPostType);

        registry.registerMainMenuAction(
            <FormattedMessage
                id='plugin.name'
                defaultMessage='Demo Plugin'
            />,
            () => store.dispatch(mainMenuAction()),
            <MainMenuMobileIcon/>,
        );

        registry.registerChannelHeaderMenuAction(
            <FormattedMessage
                id='plugin.name'
                defaultMessage='Demo Plugin'
            />,
            (channelId) => store.dispatch(channelHeaderMenuAction(channelId)),
            <MainMenuMobileIcon/>,
        );

        registry.registerMainMenuAction(
            <FormattedMessage
                id='sample.confirmation.dialog'
                defaultMessage='Sample Confirmation Dialog'
            />,
            () => {
                window.openInteractiveDialog({
                    dialog: {
                        callback_id: 'somecallbackid',
                        url: '/plugins/' + pluginId + '/dialog/2',
                        title: 'Sample Confirmation Dialog',
                        elements: [],
                        submit_label: 'Confirm',
                        notify_on_cancel: true,
                        state: 'somestate',
                    },
                });
            },
            <MainMenuMobileIcon/>,
        );

        registry.registerPostDropdownMenuAction(
            <FormattedMessage
                id='plugin.name'
                defaultMessage='Demo Plugin'
            />,
            () => store.dispatch(postDropdownMenuAction()),
        );

        // eslint-disable-next-line no-unused-vars
        const {id, rootRegisterMenuItem} = registry.registerPostDropdownSubMenuAction(
            <FormattedMessage
                id='submenu.menu'
                key='submenu.menu'
                defaultMessage='Submenu Example'
            />
        );

        const firstItem = (
            <FormattedMessage
                id='submenu.first'
                key='submenu.first'
                defaultMessage='First Item'
            />
        );
        rootRegisterMenuItem(
            firstItem,
            () => {
                store.dispatch(postDropdownSubMenuAction(firstItem));
            }
        );

        const secondItem = (
            <FormattedMessage
                id='submenu.second'
                key='submenu.second'
                defaultMessage='Second Item'
            />
        );
        rootRegisterMenuItem(
            secondItem,
            () => {
                store.dispatch(postDropdownSubMenuAction(secondItem));
            }
        );

        const thirdItem = (
            <FormattedMessage
                id='submenu.third'
                key='submenu.third'
                defaultMessage='Third Item'
            />
        );
        rootRegisterMenuItem(
            thirdItem,
            () => {
                store.dispatch(postDropdownSubMenuAction(thirdItem));
            }
        );

        registry.registerFileUploadMethod(
            <FileUploadMethodIcon/>,
            () => store.dispatch(fileUploadMethodAction()),
            <FormattedMessage
                id='plugin.upload'
                defaultMessage='Upload using Demo Plugin'
            />,
        );

        // ignore if registerFileDropdownMenuAction method does not exist
        if (registry.registerFileDropdownMenuAction) {
            registry.registerFileDropdownMenuAction(
                (fileInfo) => fileInfo.extension === 'demo',
                <FormattedMessage
                    id='plugin.name'
                    defaultMessage='Demo Plugin'
                />,
                () => store.dispatch(fileDropdownMenuAction()),
            );
        }

        registry.registerWebSocketEventHandler(
            'custom_' + pluginId + '_status_change',
            (message) => {
                store.dispatch(websocketStatusChange(message));
            },
        );

        registry.registerAdminConsoleCustomSetting('SecretMessage', SecretMessageSetting, {showTitle: true});
        registry.registerAdminConsoleCustomSetting('CustomSetting', CustomSetting);

        registry.registerFilePreviewComponent((fileInfo) => fileInfo.extension === 'demo', FilePreviewOverride);

        registry.registerReducer(reducer);

        // Immediately fetch the current plugin status.
        store.dispatch(getStatus());

        // Fetch the current status whenever we recover an internet connection.
        registry.registerReconnectHandler(() => {
            store.dispatch(getStatus());
        });

        registry.registerTranslations(getTranslations);

        registry.registerNeedsTeamRoute('/teamtest', RouterShowcase);
        registry.registerCustomRoute('/roottest', () => 'Demo plugin route.');
    }

    uninitialize() {
        //eslint-disable-next-line no-console
        console.log(pluginId + '::uninitialize()');
    }
}
