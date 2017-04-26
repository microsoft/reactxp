import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Profiling extends RX.Profiling {
    installWatchdog(): void;
    start(): void;
    stop(): void;
    printResults(config: Types.ProfilingLoggingConfig): void;
}
declare var _default: Profiling;
export default _default;
