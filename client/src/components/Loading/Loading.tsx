export const Loading = (props: { visible: boolean }) => {
  return props.visible ? (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-t-white border-white/20 rounded-full animate-spin" />
    </div>
  ) : null;
};
