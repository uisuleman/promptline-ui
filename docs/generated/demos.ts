import * as d_accordion from "../demos/accordion";
import * as d_actions from "../demos/actions";
import * as d_agent_gallery from "../demos/agent-gallery";
import * as d_agent_runs from "../demos/agent-runs";
import * as d_alert_dialog from "../demos/alert-dialog";
import * as d_alert from "../demos/alert";
import * as d_announcement from "../demos/announcement";
import * as d_api_key_input from "../demos/api-key-input";
import * as d_artifact from "../demos/artifact";
import * as d_attachments from "../demos/attachments";
import * as d_audio_player from "../demos/audio-player";
import * as d_avatar from "../demos/avatar";
import * as d_badge from "../demos/badge";
import * as d_branch from "../demos/branch";
import * as d_breadcrumb from "../demos/breadcrumb";
import * as d_button from "../demos/button";
import * as d_card from "../demos/card";
import * as d_chain_of_thought from "../demos/chain-of-thought";
import * as d_chat_sidebar from "../demos/chat-sidebar";
import * as d_checkbox from "../demos/checkbox";
import * as d_clarifying_question from "../demos/clarifying-question";
import * as d_code_block from "../demos/code-block";
import * as d_collapsible from "../demos/collapsible";
import * as d_combobox from "../demos/combobox";
import * as d_command_bar from "../demos/command-bar";
import * as d_confidence from "../demos/confidence";
import * as d_confirmation from "../demos/confirmation";
import * as d_connectors from "../demos/connectors";
import * as d_context_menu from "../demos/context-menu";
import * as d_context from "../demos/context";
import * as d_conversation from "../demos/conversation";
import * as d_data_table from "../demos/data-table";
import * as d_date_picker from "../demos/date-picker";
import * as d_dialog from "../demos/dialog";
import * as d_diff_view from "../demos/diff-view";
import * as d_dropdown_menu from "../demos/dropdown-menu";
import * as d_empty_state from "../demos/empty-state";
import * as d_feedback_dialog from "../demos/feedback-dialog";
import * as d_field from "../demos/field";
import * as d_file_tree from "../demos/file-tree";
import * as d_generate_button from "../demos/generate-button";
import * as d_generated_image from "../demos/generated-image";
import * as d_hover_card from "../demos/hover-card";
import * as d_image_variations from "../demos/image-variations";
import * as d_inline_ai from "../demos/inline-ai";
import * as d_inline_citation from "../demos/inline-citation";
import * as d_input_otp from "../demos/input-otp";
import * as d_input from "../demos/input";
import * as d_json_viewer from "../demos/json-viewer";
import * as d_kbd from "../demos/kbd";
import * as d_knowledge_upload from "../demos/knowledge-upload";
import * as d_loader from "../demos/loader";
import * as d_memory from "../demos/memory";
import * as d_mention_picker from "../demos/mention-picker";
import * as d_message from "../demos/message";
import * as d_model_selector from "../demos/model-selector";
import * as d_model_status from "../demos/model-status";
import * as d_number_input from "../demos/number-input";
import * as d_onboarding_wizard from "../demos/onboarding-wizard";
import * as d_pagination from "../demos/pagination";
import * as d_plan from "../demos/plan";
import * as d_popover from "../demos/popover";
import * as d_progress from "../demos/progress";
import * as d_prompt_input from "../demos/prompt-input";
import * as d_prompt_template from "../demos/prompt-template";
import * as d_queue from "../demos/queue";
import * as d_radio_group from "../demos/radio-group";
import * as d_reasoning from "../demos/reasoning";
import * as d_relative_time from "../demos/relative-time";
import * as d_research_progress from "../demos/research-progress";
import * as d_resizable from "../demos/resizable";
import * as d_response_compare from "../demos/response-compare";
import * as d_scroll_area from "../demos/scroll-area";
import * as d_select from "../demos/select";
import * as d_separator from "../demos/separator";
import * as d_share_dialog from "../demos/share-dialog";
import * as d_sheet from "../demos/sheet";
import * as d_skeleton from "../demos/skeleton";
import * as d_slash_commands from "../demos/slash-commands";
import * as d_slider from "../demos/slider";
import * as d_sources from "../demos/sources";
import * as d_spinner from "../demos/spinner";
import * as d_status_banner from "../demos/status-banner";
import * as d_streaming_text from "../demos/streaming-text";
import * as d_suggestion from "../demos/suggestion";
import * as d_switch from "../demos/switch";
import * as d_table from "../demos/table";
import * as d_tabs from "../demos/tabs";
import * as d_tags_input from "../demos/tags-input";
import * as d_task from "../demos/task";
import * as d_textarea from "../demos/textarea";
import * as d_toast from "../demos/toast";
import * as d_toggle from "../demos/toggle";
import * as d_tool from "../demos/tool";
import * as d_tooltip from "../demos/tooltip";
import * as d_upgrade_dialog from "../demos/upgrade-dialog";
import * as d_usage_chart from "../demos/usage-chart";
import * as d_usage_meter from "../demos/usage-meter";
import * as d_voice_input from "../demos/voice-input";
import * as d_voice_mode from "../demos/voice-mode";
import * as d_web_preview from "../demos/web-preview";

export const demos: Record<string, Record<string, () => import("react").ReactElement>> = {
  "accordion": d_accordion as any,
  "actions": d_actions as any,
  "agent-gallery": d_agent_gallery as any,
  "agent-runs": d_agent_runs as any,
  "alert-dialog": d_alert_dialog as any,
  "alert": d_alert as any,
  "announcement": d_announcement as any,
  "api-key-input": d_api_key_input as any,
  "artifact": d_artifact as any,
  "attachments": d_attachments as any,
  "audio-player": d_audio_player as any,
  "avatar": d_avatar as any,
  "badge": d_badge as any,
  "branch": d_branch as any,
  "breadcrumb": d_breadcrumb as any,
  "button": d_button as any,
  "card": d_card as any,
  "chain-of-thought": d_chain_of_thought as any,
  "chat-sidebar": d_chat_sidebar as any,
  "checkbox": d_checkbox as any,
  "clarifying-question": d_clarifying_question as any,
  "code-block": d_code_block as any,
  "collapsible": d_collapsible as any,
  "combobox": d_combobox as any,
  "command-bar": d_command_bar as any,
  "confidence": d_confidence as any,
  "confirmation": d_confirmation as any,
  "connectors": d_connectors as any,
  "context-menu": d_context_menu as any,
  "context": d_context as any,
  "conversation": d_conversation as any,
  "data-table": d_data_table as any,
  "date-picker": d_date_picker as any,
  "dialog": d_dialog as any,
  "diff-view": d_diff_view as any,
  "dropdown-menu": d_dropdown_menu as any,
  "empty-state": d_empty_state as any,
  "feedback-dialog": d_feedback_dialog as any,
  "field": d_field as any,
  "file-tree": d_file_tree as any,
  "generate-button": d_generate_button as any,
  "generated-image": d_generated_image as any,
  "hover-card": d_hover_card as any,
  "image-variations": d_image_variations as any,
  "inline-ai": d_inline_ai as any,
  "inline-citation": d_inline_citation as any,
  "input-otp": d_input_otp as any,
  "input": d_input as any,
  "json-viewer": d_json_viewer as any,
  "kbd": d_kbd as any,
  "knowledge-upload": d_knowledge_upload as any,
  "loader": d_loader as any,
  "memory": d_memory as any,
  "mention-picker": d_mention_picker as any,
  "message": d_message as any,
  "model-selector": d_model_selector as any,
  "model-status": d_model_status as any,
  "number-input": d_number_input as any,
  "onboarding-wizard": d_onboarding_wizard as any,
  "pagination": d_pagination as any,
  "plan": d_plan as any,
  "popover": d_popover as any,
  "progress": d_progress as any,
  "prompt-input": d_prompt_input as any,
  "prompt-template": d_prompt_template as any,
  "queue": d_queue as any,
  "radio-group": d_radio_group as any,
  "reasoning": d_reasoning as any,
  "relative-time": d_relative_time as any,
  "research-progress": d_research_progress as any,
  "resizable": d_resizable as any,
  "response-compare": d_response_compare as any,
  "scroll-area": d_scroll_area as any,
  "select": d_select as any,
  "separator": d_separator as any,
  "share-dialog": d_share_dialog as any,
  "sheet": d_sheet as any,
  "skeleton": d_skeleton as any,
  "slash-commands": d_slash_commands as any,
  "slider": d_slider as any,
  "sources": d_sources as any,
  "spinner": d_spinner as any,
  "status-banner": d_status_banner as any,
  "streaming-text": d_streaming_text as any,
  "suggestion": d_suggestion as any,
  "switch": d_switch as any,
  "table": d_table as any,
  "tabs": d_tabs as any,
  "tags-input": d_tags_input as any,
  "task": d_task as any,
  "textarea": d_textarea as any,
  "toast": d_toast as any,
  "toggle": d_toggle as any,
  "tool": d_tool as any,
  "tooltip": d_tooltip as any,
  "upgrade-dialog": d_upgrade_dialog as any,
  "usage-chart": d_usage_chart as any,
  "usage-meter": d_usage_meter as any,
  "voice-input": d_voice_input as any,
  "voice-mode": d_voice_mode as any,
  "web-preview": d_web_preview as any,
};
